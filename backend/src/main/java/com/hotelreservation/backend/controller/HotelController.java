package com.hotelreservation.backend.controller;

import com.hotelreservation.backend.entity.Hotel;
import com.hotelreservation.backend.entity.Room;
import com.hotelreservation.backend.repository.HotelRepository;
import com.hotelreservation.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "*")
public class HotelController {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllHotels(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxPrice) {
        
        try {
            // Verify repository is available
            if (hotelRepository == null) {
                throw new IllegalStateException("HotelRepository is not initialized");
            }
            
            List<Hotel> hotels;
            
            // Apply filters if provided
            if (city != null && !city.isEmpty()) {
                hotels = hotelRepository.findByCityContainingIgnoreCase(city);
            } else {
                hotels = hotelRepository.findAll();
            }
            
            // Ensure we have a valid list
            if (hotels == null) {
                System.err.println("WARNING: hotelRepository returned null, using empty list");
                hotels = new ArrayList<>();
            }
            
            // Filter by rating if provided
            if (minRating != null && hotels != null) {
                hotels = hotels.stream()
                        .filter(h -> h != null && h.getRating() != null && h.getRating() >= minRating)
                        .toList();
            }
            
            // Filter by max price if provided
            if (maxPrice != null && hotels != null) {
                hotels = hotels.stream()
                        .filter(h -> h != null && h.getPricePerNight() != null && h.getPricePerNight() <= maxPrice)
                        .toList();
            }
            
            // Final null check
            if (hotels == null) {
                hotels = new ArrayList<>();
            }
            
            System.out.println("GET /api/hotels - Hotels count = " + hotels.size());
            System.out.println("GET /api/hotels - Filters: city=" + city + ", minRating=" + minRating + ", maxPrice=" + maxPrice);
            
            // Log warning if we have fewer than expected hotels (when no filters applied)
            if (city == null && minRating == null && maxPrice == null && hotels.size() < 10) {
                System.err.println("WARNING: GET /api/hotels returned only " + hotels.size() + " hotels. Expected 10. Check database seeding.");
            }
            
            // Always return 200 OK with JSON array, even if empty
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(hotels);
                    
        } catch (Exception e) {
            System.err.println("ERROR in getAllHotels: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
            
            // Log full stack trace for debugging
            StackTraceElement[] stackTrace = e.getStackTrace();
            System.err.println("Stack trace:");
            for (int i = 0; i < Math.min(10, stackTrace.length); i++) {
                System.err.println("  at " + stackTrace[i]);
            }
            
            // Return proper error response with JSON body
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch hotels");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public Hotel getHotelById(@PathVariable Long id) {
        return hotelRepository.findById(id).orElse(null);
    }

    @GetMapping(value = "/{id}/rooms", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getRoomsByHotelId(@PathVariable Long id) {
        try {
            System.out.println("GET /api/hotels/" + id + "/rooms - Request received");
            
            // Verify hotel exists
            Hotel hotel = hotelRepository.findById(id).orElse(null);
            if (hotel == null) {
                System.err.println("GET /api/hotels/" + id + "/rooms - Hotel not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of("error", "Hotel not found", "status", 404));
            }
            
            // Query rooms directly from RoomRepository to avoid lazy loading issues
            List<Room> rooms = roomRepository.findByHotelId(id);
            
            if (rooms == null) {
                rooms = new ArrayList<>();
            }
            
            System.out.println("GET /api/hotels/" + id + "/rooms - Returning " + rooms.size() + " rooms");
            
            // Log room IDs for debugging
            if (!rooms.isEmpty()) {
                System.out.println("GET /api/hotels/" + id + "/rooms - Room IDs: " + 
                    rooms.stream().map(r -> r.getRoomId().toString()).toList());
            } else {
                System.err.println("GET /api/hotels/" + id + "/rooms - WARNING: No rooms found for hotel ID " + id);
                System.err.println("GET /api/hotels/" + id + "/rooms - This may indicate rooms were not seeded properly.");
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(rooms);
        } catch (Exception e) {
            System.err.println("GET /api/hotels/" + id + "/rooms - Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("error", "Failed to fetch rooms", "status", 500));
        }
    }
}

