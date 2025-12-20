package com.hotelreservation.backend.controller;

import com.hotelreservation.backend.entity.*;
import com.hotelreservation.backend.repository.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final CustomerRepository customerRepository;

    public ReservationController(
            ReservationRepository reservationRepository,
            RoomRepository roomRepository,
            CustomerRepository customerRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {
        Optional<Room> roomOpt = roomRepository.findById(reservation.getRoom().getRoomId());
        Optional<Customer> customerOpt = customerRepository.findById(reservation.getCustomer().getCustomerId());

        if (roomOpt.isEmpty() || customerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid room or customer ID");
        }

        Room room = roomOpt.get();
        if (!room.isAvailable()) {
            return ResponseEntity.badRequest().body("Room is not available");
        }

        long days = ChronoUnit.DAYS.between(reservation.getCheckInDate(), reservation.getCheckOutDate());
        if (days <= 0) {
            return ResponseEntity.badRequest().body("Invalid date range");
        }

        double totalPrice = days * room.getPricePerNight();

        reservation.setRoom(room);
        reservation.setCustomer(customerOpt.get());
        reservation.setTotalPrice(totalPrice);
        reservation.setStatus(Reservation.ReservationStatus.CONFIRMED);

        // Update room availability
        room.setAvailable(false);
        roomRepository.save(room);

        Reservation saved = reservationRepository.save(reservation);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(id);
        if (reservationOpt.isEmpty()) return ResponseEntity.notFound().build();

        Reservation reservation = reservationOpt.get();
        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);

        // Make room available again
        Room room = reservation.getRoom();
        room.setAvailable(true);
        roomRepository.save(room);

        reservationRepository.save(reservation);
        return ResponseEntity.ok("Reservation cancelled successfully.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        reservationRepository.deleteById(id);
        return ResponseEntity.ok("Reservation deleted.");
    }
}
