package com.hotelreservation.backend.repository;

import com.hotelreservation.backend.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByCityContainingIgnoreCase(String city);
    List<Hotel> findByRatingGreaterThanEqual(Double minRating);
    List<Hotel> findByPricePerNightLessThanEqual(Double maxPrice);
}

