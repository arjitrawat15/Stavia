package com.hotelreservation.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotelreservation.backend.dto.LoginRequest;
import com.hotelreservation.backend.dto.SignupRequest;
import com.hotelreservation.backend.entity.Hotel;
import com.hotelreservation.backend.entity.Room;
import com.hotelreservation.backend.entity.User;
import com.hotelreservation.backend.repository.HotelRepository;
import com.hotelreservation.backend.repository.RoomRepository;
import com.hotelreservation.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthAndBookingIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;
    private Hotel testHotel;
    private Room testRoom;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setPassword(passwordEncoder.encode("password123"));
        testUser.setFullName("Test User");
        testUser.setPhoneNumber("+1234567890");
        testUser = userRepository.save(testUser);

        // Create test hotel
        testHotel = new Hotel();
        testHotel.setName("Test Hotel");
        testHotel.setCity("Test City");
        testHotel.setCountry("Test Country");
        testHotel.setRating(4.5);
        testHotel.setPricePerNight(100.0);
        testHotel = hotelRepository.save(testHotel);

        // Create test room
        testRoom = new Room();
        testRoom.setRoomNumber("101");
        testRoom.setRoomType("Deluxe");
        testRoom.setPricePerNight(100.0);
        testRoom.setAvailable(true);
        testRoom.setHotel(testHotel);
        testRoom = roomRepository.save(testRoom);
    }

    @Test
    void testLoginFlow() throws Exception {
        // Test login
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        Map<String, Object> response = objectMapper.readValue(responseBody, Map.class);
        String token = (String) response.get("token");

        // Verify token is not null
        assert token != null && !token.isEmpty();
    }

    @Test
    void testSignupFlow() throws Exception {
        // Test signup
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("newuser@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setFullName("New User");
        signupRequest.setPhoneNumber("+1234567890");

        MvcResult signupResult = mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.email").value("newuser@example.com"))
                .andReturn();

        String responseBody = signupResult.getResponse().getContentAsString();
        Map<String, Object> response = objectMapper.readValue(responseBody, Map.class);
        String token = (String) response.get("token");

        // Verify token is not null
        assert token != null && !token.isEmpty();
    }

    @Test
    void testBookingWithoutAuth() throws Exception {
        // Attempt booking without authentication should fail
        Map<String, Object> bookingRequest = createBookingRequest();

        mockMvc.perform(post("/api/bookings/hotel")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bookingRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void testLoginAndBookingFlow() throws Exception {
        // Step 1: Login
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String loginResponseBody = loginResult.getResponse().getContentAsString();
        Map<String, Object> loginResponse = objectMapper.readValue(loginResponseBody, Map.class);
        String token = (String) loginResponse.get("token");

        // Step 2: Create booking with token
        Map<String, Object> bookingRequest = createBookingRequest();

        mockMvc.perform(post("/api/bookings/hotel")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bookingRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.bookingId").exists())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    void testInvalidTokenBooking() throws Exception {
        // Attempt booking with invalid token
        Map<String, Object> bookingRequest = createBookingRequest();

        mockMvc.perform(post("/api/bookings/hotel")
                .header("Authorization", "Bearer invalid_token_12345")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bookingRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    private Map<String, Object> createBookingRequest() {
        Map<String, Object> request = new HashMap<>();
        request.put("hotelId", testHotel.getId());
        request.put("roomId", testRoom.getRoomId());
        request.put("checkIn", LocalDate.now().plusDays(1).toString());
        request.put("checkOut", LocalDate.now().plusDays(3).toString());
        request.put("guests", 2);
        request.put("contactName", "Test User");
        request.put("contactEmail", "test@example.com");
        request.put("contactPhone", "+1234567890");
        request.put("totalPrice", 200.0);
        return request;
    }
}

