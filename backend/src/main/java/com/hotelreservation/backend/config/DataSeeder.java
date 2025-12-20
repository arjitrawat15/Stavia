package com.hotelreservation.backend.config;

import com.hotelreservation.backend.entity.Hotel;
import com.hotelreservation.backend.entity.Room;
import com.hotelreservation.backend.repository.HotelRepository;
import com.hotelreservation.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public void run(String... args) {
        try {
            // Verify repository is available
            if (hotelRepository == null) {
                System.err.println("DataSeeder: ERROR - HotelRepository is null, cannot seed data");
                return;
            }
            
            long existingCount = hotelRepository.count();
            System.out.println("DataSeeder: Current hotel count in database: " + existingCount);
        
        // Define all 10 hotels that should exist
        List<Hotel> allHotels = Arrays.asList(
            createHotel("Grand Luxury Resort", "Paris", "France", 4.8, 299.0,
                "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
                Arrays.asList("Luxury", "Spa", "Pool"), "Top Pick",
                "Experience world-class luxury in the heart of Paris with stunning city views and exceptional service."),
            
            createHotel("Oceanview Beach Hotel", "Barcelona", "Spain", 4.6, 189.0,
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
                Arrays.asList("Beach", "Family", "Restaurant"), null,
                "Stunning ocean views and family-friendly amenities right on the Mediterranean coast."),
            
            createHotel("Mountain Retreat Lodge", "Switzerland", "Switzerland", 4.9, 349.0,
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
                Arrays.asList("Mountain", "Ski", "Wellness"), "Top Pick",
                "Escape to the mountains for ultimate relaxation with breathtaking alpine views."),
            
            createHotel("Tropical Paradise Resort", "Bali", "Indonesia", 4.7, 159.0,
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
                Arrays.asList("Tropical", "Beach", "Spa"), "Best Seller",
                "Lush tropical gardens, infinity pools, and pristine beaches await you in paradise."),
            
            createHotel("Urban Boutique Hotel", "New York", "USA", 4.5, 249.0,
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
                Arrays.asList("City", "Boutique", "Art"), null,
                "Chic design hotel in the heart of Manhattan with contemporary art and modern amenities."),
            
            createHotel("Desert Oasis Resort", "Dubai", "UAE", 4.8, 399.0,
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
                Arrays.asList("Luxury", "Desert", "Spa"), "Top Pick",
                "Ultra-luxury desert resort with world-class spa facilities and stunning architecture."),
            
            createHotel("Coastal Villa Collection", "Santorini", "Greece", 4.9, 279.0,
                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
                Arrays.asList("Beach", "Romantic", "Villa"), "Best Seller",
                "Stunning white-washed villas with panoramic sea views and private terraces."),
            
            createHotel("Historic Grand Hotel", "Vienna", "Austria", 4.6, 229.0,
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
                Arrays.asList("Historic", "Luxury", "Culture"), null,
                "Elegant 19th-century architecture meets modern luxury in the heart of Vienna."),
            
            createHotel("Jungle Eco Lodge", "Costa Rica", "Costa Rica", 4.7, 179.0,
                "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop",
                Arrays.asList("Eco", "Nature", "Adventure"), null,
                "Sustainable luxury in the heart of the rainforest with wildlife viewing and adventure activities."),
            
            createHotel("Island Resort & Spa", "Maldives", "Maldives", 4.9, 449.0,
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
                Arrays.asList("Island", "Luxury", "Overwater"), "Top Pick",
                "Exclusive overwater villas with direct lagoon access and world-renowned diving.")
        );
        
        // If database is empty, seed all hotels
        if (existingCount == 0) {
            System.out.println("DataSeeder: Database is empty. Seeding all " + allHotels.size() + " hotels...");
            hotelRepository.saveAll(allHotels);
            long newCount = hotelRepository.count();
            System.out.println("DataSeeder: Successfully seeded hotels! New count: " + newCount);
            
            if (newCount != allHotels.size()) {
                System.err.println("DataSeeder: WARNING - Expected " + allHotels.size() + " hotels but only " + newCount + " were saved!");
            }
        } else if (existingCount < allHotels.size()) {
            // If we have fewer than 10 hotels, seed the missing ones
            System.out.println("DataSeeder: Database has " + existingCount + " hotels, but expected " + allHotels.size() + ". Seeding missing hotels...");
            
            // Get existing hotel names to avoid duplicates
            List<String> existingNames = hotelRepository.findAll().stream()
                    .map(Hotel::getName)
                    .toList();
            
            // Filter out hotels that already exist
            List<Hotel> missingHotels = allHotels.stream()
                    .filter(hotel -> !existingNames.contains(hotel.getName()))
                    .toList();
            
            if (!missingHotels.isEmpty()) {
                System.out.println("DataSeeder: Adding " + missingHotels.size() + " missing hotels...");
                hotelRepository.saveAll(missingHotels);
                long newCount = hotelRepository.count();
                System.out.println("DataSeeder: Successfully added missing hotels! New count: " + newCount);
            } else {
                System.out.println("DataSeeder: All hotel names already exist, but count is less than expected. This may indicate a data issue.");
            }
        } else {
            System.out.println("DataSeeder: Database already has " + existingCount + " hotels. Skipping seed.");
        }
        
            // Final verification
            long finalCount = hotelRepository.count();
            System.out.println("DataSeeder: Final hotel count: " + finalCount);
            if (finalCount < allHotels.size()) {
                System.err.println("DataSeeder: ERROR - Expected " + allHotels.size() + " hotels but database only has " + finalCount + "!");
            }

            // Seed rooms for all hotels
            seedRoomsForHotels();
            
        } catch (Exception e) {
            System.err.println("DataSeeder: CRITICAL ERROR during seeding: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
            System.err.println("DataSeeder: Application will continue, but hotels may not be seeded. Check database connection and configuration.");
        }
    }

    private void seedRoomsForHotels() {
        try {
            List<Hotel> hotels = hotelRepository.findAll();
            long existingRoomCount = roomRepository.count();
            
            System.out.println("DataSeeder: Current room count: " + existingRoomCount);
            System.out.println("DataSeeder: Seeding rooms for " + hotels.size() + " hotels...");
            
            String[] roomTypes = {"Standard", "Deluxe", "Suite", "VIP Suite", "Presidential"};
            int[] roomCounts = {4, 4, 3, 2, 1}; // Number of each room type per hotel
            int[] capacities = {2, 2, 3, 4, 6}; // Capacity for each room type
            double[] priceMultipliers = {1.0, 1.3, 1.8, 2.5, 4.0}; // Price multipliers
            
            int totalRoomsCreated = 0;
            
            for (Hotel hotel : hotels) {
                // Check if hotel already has rooms by querying RoomRepository directly
                // This avoids lazy loading issues
                List<Room> existingRooms = roomRepository.findByHotelId(hotel.getId());
                if (existingRooms != null && !existingRooms.isEmpty()) {
                    System.out.println("DataSeeder: Hotel " + hotel.getId() + " (" + hotel.getName() + ") already has " + existingRooms.size() + " rooms. Skipping.");
                    continue;
                }
                
                int roomNumberSuffix = 1;
                
                for (int typeIndex = 0; typeIndex < roomTypes.length; typeIndex++) {
                    String roomType = roomTypes[typeIndex];
                    int count = roomCounts[typeIndex];
                    int capacity = capacities[typeIndex];
                    double price = hotel.getPricePerNight() * priceMultipliers[typeIndex];
                    
                    for (int i = 0; i < count; i++) {
                        Room room = new Room();
                        room.setRoomNumber(hotel.getId() + String.format("%02d", roomNumberSuffix++));
                        room.setRoomType(roomType);
                        room.setPricePerNight(Math.round(price));
                        room.setAvailable(true);
                        room.setCapacity(capacity);
                        room.setHotel(hotel);
                        
                        roomRepository.save(room);
                        totalRoomsCreated++;
                    }
                }
                
                System.out.println("DataSeeder: Created rooms for hotel " + hotel.getId() + " (" + hotel.getName() + ")");
            }
            
            long finalRoomCount = roomRepository.count();
            System.out.println("DataSeeder: Room seeding complete! Created " + totalRoomsCreated + " rooms. Total rooms: " + finalRoomCount);
            
        } catch (Exception e) {
            System.err.println("DataSeeder: ERROR during room seeding: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
        }
    }

    private Hotel createHotel(String name, String city, String country, 
                             Double rating, Double pricePerNight, String heroImage,
                             List<String> tags, String badge, String description) {
        Hotel hotel = new Hotel();
        hotel.setName(name);
        hotel.setCity(city);
        hotel.setCountry(country);
        hotel.setRating(rating);
        hotel.setPricePerNight(pricePerNight);
        hotel.setHeroImage(heroImage);
        hotel.setTags(tags);
        hotel.setBadge(badge);
        hotel.setDescription(description);
        return hotel;
    }
}

