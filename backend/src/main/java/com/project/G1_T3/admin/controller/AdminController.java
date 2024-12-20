package com.project.G1_T3.admin.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.G1_T3.admin.model.LockUserRequest;
import com.project.G1_T3.admin.service.AdminService;
import com.project.G1_T3.authentication.model.AdminRegisterRequestDTO;
import com.project.G1_T3.user.model.UserDTO;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<String> getAdminDashboard() {
        return ResponseEntity.ok("Welcome to the admin dashboard!");
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserDTO>> getPaginatedUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "username") String field,
            @RequestParam(defaultValue = "asc") String order) {

        Page<UserDTO> users = adminService.getPaginatedUsers(page, size, field, order);
        return ResponseEntity.ok(users);
    }

    @PostMapping()
    public ResponseEntity<UserDTO> registerAdmin(@Valid @RequestBody AdminRegisterRequestDTO registerRequest) {

        UserDTO userDTO = adminService.registerAdmin(
                registerRequest.getUsername(),
                registerRequest.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(userDTO);
    }

    // Edit isLocked status
    @PutMapping("/lock")
    public ResponseEntity<String> updateUserLockedStatus(@RequestBody LockUserRequest lockUserRequest) {
        adminService.updateUserLockedStatus(UUID.fromString(lockUserRequest.getUserId()), lockUserRequest.isLocked());
        return ResponseEntity.ok("User lock status updated successfully");
    }

    // Reset admin email and password
    @PostMapping("/reset-admin-password")
    public ResponseEntity<String> resetAdminPassword(@RequestBody String adminId) {
        adminService.resetAdminPassword(UUID.fromString(adminId));
        return ResponseEntity.ok("Temporary password has been sent to the admin.");
    }
}