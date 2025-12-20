package com.hotelreservation.backend.controller;

import com.hotelreservation.backend.dto.BookingResponse;
import com.hotelreservation.backend.dto.HotelBookingRequest;
import com.hotelreservation.backend.entity.*;
import com.hotelreservation.backend.repository.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping(value = "/hotel", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createHotelBooking(
            @Valid @RequestBody HotelBookingRequest request,
            Authentication authentication) {
        
        try {
            // Verify authentication
            if (authentication == null || !authentication.isAuthenticated()) {
                System.err.println("POST /api/bookings/hotel - Unauthenticated request");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse("Authentication required", HttpStatus.UNAUTHORIZED.value()));
            }

            String userEmail = authentication.getName();
            System.out.println("POST /api/bookings/hotel - Request from user: " + userEmail);

            // Validate dates
            if (request.getCheckOut().isBefore(request.getCheckIn()) || 
                request.getCheckOut().isEqual(request.getCheckIn())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse("Check-out date must be after check-in date", 
                                HttpStatus.BAD_REQUEST.value()));
            }

            // Find room with detailed logging
            System.out.println("POST /api/bookings/hotel - Looking for room with ID: " + request.getRoomId());
            System.out.println("POST /api/bookings/hotel - Hotel ID: " + request.getHotelId());
            
            Optional<Room> roomOpt = roomRepository.findById(request.getRoomId());
            if (roomOpt.isEmpty()) {
                System.err.println("POST /api/bookings/hotel - Room not found with ID: " + request.getRoomId());
                System.err.println("POST /api/bookings/hotel - Total rooms in database: " + roomRepository.count());
                
                // Log available room IDs for debugging
                List<Room> allRooms = roomRepository.findAll();
                System.err.println("POST /api/bookings/hotel - Available room IDs: " + 
                    allRooms.stream().map(Room::getRoomId).toList());
                
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse("Room not found with ID: " + request.getRoomId(), HttpStatus.NOT_FOUND.value()));
            }

            Room room = roomOpt.get();
            
            // Verify room belongs to the hotel
            if (room.getHotel() == null || !room.getHotel().getId().equals(request.getHotelId())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse("Room does not belong to the specified hotel", 
                                HttpStatus.BAD_REQUEST.value()));
            }

            // Check room availability
            if (!room.isAvailable()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse("Room is not available", HttpStatus.BAD_REQUEST.value()));
            }

            // Find or create customer
            Customer customer = customerRepository.findByEmail(request.getContactEmail())
                    .orElseGet(() -> {
                        Customer newCustomer = new Customer();
                        newCustomer.setFullName(request.getContactName());
                        newCustomer.setEmail(request.getContactEmail());
                        newCustomer.setPhoneNumber(request.getContactPhone());
                        return customerRepository.save(newCustomer);
                    });

            // Calculate total price
            long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
            double calculatedPrice = nights * room.getPricePerNight();
            
            // Use provided total price or calculated price
            double finalPrice = request.getTotalPrice() != null ? request.getTotalPrice() : calculatedPrice;

            // Create reservation
            Reservation reservation = new Reservation();
            reservation.setRoom(room);
            reservation.setCustomer(customer);
            reservation.setCheckInDate(request.getCheckIn());
            reservation.setCheckOutDate(request.getCheckOut());
            reservation.setTotalPrice(finalPrice);
            reservation.setStatus(Reservation.ReservationStatus.CONFIRMED);

            // Update room availability
            room.setAvailable(false);
            roomRepository.save(room);

            // Save reservation
            Reservation savedReservation = reservationRepository.save(reservation);

            // Build response
            Map<String, Object> summary = new HashMap<>();
            summary.put("hotel", room.getHotel().getName());
            summary.put("room", room.getRoomType());
            summary.put("checkIn", savedReservation.getCheckInDate().toString());
            summary.put("checkOut", savedReservation.getCheckOutDate().toString());
            summary.put("guests", request.getGuests());
            summary.put("totalPrice", savedReservation.getTotalPrice());

            BookingResponse response = new BookingResponse();
            response.setBookingId("HTL-" + savedReservation.getReservationId());
            response.setHotelId(request.getHotelId());
            response.setRoomId(request.getRoomId());
            response.setCheckIn(savedReservation.getCheckInDate());
            response.setCheckOut(savedReservation.getCheckOutDate());
            response.setGuests(request.getGuests());
            response.setTotalPrice(savedReservation.getTotalPrice());
            response.setStatus("CONFIRMED");
            response.setSummary(summary);

            System.out.println("POST /api/bookings/hotel - Success: Booking created with ID " + 
                    response.getBookingId());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);

        } catch (Exception e) {
            System.err.println("POST /api/bookings/hotel - Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(createErrorResponse("Failed to create booking: " + e.getMessage(), 
                            HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @PostMapping(value = "/restaurant", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createRestaurantBooking(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        
        try {
            // Verify authentication
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse("Authentication required", HttpStatus.UNAUTHORIZED.value()));
            }

            // Restaurant booking is a placeholder - implement as needed
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(createErrorResponse("Restaurant booking not yet implemented", 
                            HttpStatus.NOT_IMPLEMENTED.value()));

        } catch (Exception e) {
            System.err.println("POST /api/bookings/restaurant - Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(createErrorResponse("Failed to create restaurant booking: " + e.getMessage(), 
                            HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @GetMapping(value = "/user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getUserBookings(
            @PathVariable Long userId,
            Authentication authentication) {
        
        try {
            // Verify authentication
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse("Authentication required", HttpStatus.UNAUTHORIZED.value()));
            }

            // Verify user can only access their own bookings
            String userEmail = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty() || !userOpt.get().getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse("Access denied", HttpStatus.FORBIDDEN.value()));
            }

            // Find customer by user email
            Optional<Customer> customerOpt = customerRepository.findByEmail(userEmail);
            if (customerOpt.isEmpty()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(new java.util.ArrayList<>());
            }

            // Get reservations for this customer
            // Note: This requires a relationship between Customer and Reservation
            // For now, return empty list
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new java.util.ArrayList<>());

        } catch (Exception e) {
            System.err.println("GET /api/bookings/user/" + userId + " - Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(createErrorResponse("Failed to fetch bookings: " + e.getMessage(), 
                            HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    private Map<String, Object> createErrorResponse(String message, int status) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", message);
        error.put("status", status);
        return error;
    }
}

