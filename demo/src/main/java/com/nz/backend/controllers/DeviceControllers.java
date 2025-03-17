package com.nz.backend.controllers;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nz.backend.dto.AddNewDeviceDTO;
import com.nz.backend.dto.DeviceNameDTO;
import com.nz.backend.dto.DeviceOnOffDTO;
import com.nz.backend.dto.DeviceRoomDTO;
import com.nz.backend.dto.EmailDTO;
import com.nz.backend.dto.UpdateDeviceDTO;
import com.nz.backend.entities.Category;
import com.nz.backend.entities.Device;
import com.nz.backend.entities.Energy;
import com.nz.backend.entities.Family;
import com.nz.backend.entities.Room;
import com.nz.backend.entities.User;
import com.nz.backend.enums.OnOff;
import com.nz.backend.repo.CategoryRepo;
import com.nz.backend.repo.DeviceRepo;
import com.nz.backend.repo.EnergyRepo;
import com.nz.backend.repo.FamilyRepo;
import com.nz.backend.repo.RoomRepo;
import com.nz.backend.repo.UserRepo;
import com.nz.backend.services.JwtService;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class DeviceControllers {

    @Autowired
    private DeviceRepo deviceRepo;

    @Autowired
    private EnergyRepo energyRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private RoomRepo roomRepo;
    
    @Autowired
    private JwtService jwtService;

    @Value("${jwt.secret.key}")
    private String secretKey;

    // DONE
    @PostMapping("/addDevice")
    public ResponseEntity<?> addNewDevices(@RequestHeader("Authorization") String token, @RequestBody AddNewDeviceDTO addNewDeviceDTO) {

        // Token Verification
        if (token == null) {
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        // Find the user object
        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        // Access denied for normal user
        if (user.getRole().name().equals("User")) {
            return ResponseEntity.badRequest().body("Access Denied!");
        }

        Category category = categoryRepo.findByCategoryname(addNewDeviceDTO.getCategoryName());
        Room room = roomRepo.findByRoomName(addNewDeviceDTO.getRoomName());
        Family family = user.getFamily();

        // Warranty Expiration Date
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate customDate = LocalDate.parse("2026-03-15", formatter);

        Device newDevice = new Device(
                addNewDeviceDTO.getDeviceName(), //
                category, // 
                user,
                customDate,
                OnOff.Off,
                addNewDeviceDTO.getPicture(), //
                family,
                room); //

        deviceRepo.save(newDevice);

        return ResponseEntity.ok("Successfully Added!");
    }

    // DONE
    @PostMapping("/getDeviceDetails")
    public ResponseEntity<?> getDevicesDetails(@RequestHeader("Authorization") String token, @RequestBody DeviceNameDTO deviceNameDTO) {

        // Token verification
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);
        
        // Find the user object
        User user = userRepo.findByEmail(email); 
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        /* Match device in database, with the device name given and user's family, make sure return the device in the user's family, because may have duplicate device name */
        Device matchDevice = deviceRepo.findByDeviceNameAndFamily(deviceNameDTO.getDeviceName(), user.getFamily());
        if (matchDevice == null) {
            return ResponseEntity.badRequest().body("Device not found in the family!");
        }

        /* Return the energy statistics, with the matched device's deviceid */
        List<Energy> energyList = energyRepo.findByDeviceDeviceid(matchDevice.getDeviceid());
        // if (energyList.isEmpty()) {
        //     return ResponseEntity.badRequest().body("No energy data found for this device.");
        // }

        List<Map<String, Object>> energyDataList = new ArrayList<>();
        for (Energy energy : energyList) {
            Map<String, Object> energyData = new HashMap<>();
            energyData.put("energyConsumption", energy.getEnergyConsumption());
            energyData.put("energyUsage", energy.getEnergyUsage());
            energyData.put("date", energy.getDate());
            energyDataList.add(energyData);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("deviceName", matchDevice.getDeviceName());
        response.put("category", matchDevice.getCategory());
        response.put("picture", matchDevice.getPicture());
        response.put("onOff", matchDevice.getOnOff());
        response.put("energyData", energyDataList);
      
        return ResponseEntity.ok(response);
    }

    // DONE
    @PutMapping("/OnOff") 
    public ResponseEntity<?> turnOnOff (@RequestHeader("Authorization") String token, @RequestBody DeviceOnOffDTO deviceOnOffDTO){
        
        // Token Verification
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        // Find the user object
        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        /* Match device in database, with the device name given and user's family, make sure return the device in the user's family, because may have duplicate device name */
        Device matchDevice = deviceRepo.findByDeviceNameAndFamily(deviceOnOffDTO.getDeviceName(), user.getFamily());
        if (matchDevice == null) {
            return ResponseEntity.badRequest().body("Device not found in the family!");
        }

        // Get the status (on/off) of the selected device
        OnOff deviceStatus = matchDevice.getOnOff();

        if (deviceStatus == OnOff.On) {
            matchDevice.setOnOff(OnOff.Off);
        }

        if (deviceStatus == OnOff.Off) {
            matchDevice.setOnOff(OnOff.On);
        }
        
        deviceRepo.save(matchDevice);

        return ResponseEntity.ok("Status Changed!");
    }

    // DONE
    // @PutMapping("/OnOffAll") 
    // public ResponseEntity<?> turnOnOffAll (@RequestHeader("Authorization") String token, @RequestBody DeviceOnOffDTO deviceOnOffDTO){
        
    //     // Token Verification
    //     if (token == null){
    //         return ResponseEntity.badRequest().body("Invalid token!");
    //     }

    //     String jwtToken = token.substring(7);
    //     String email = jwtService.extractEmail(jwtToken);

    //     // Find the user object
    //     User user = userRepo.findByEmail(email);
    //     if (user == null) {
    //         return ResponseEntity.badRequest().body("User not found!");
    //     }

    //     /* Match device in database, with the device name given and user's family, make sure return the device in the user's family, because may have duplicate device name */
    //     List<Device> matchDevices = deviceRepo.findByDeviceNameAndFamily(deviceOnOffDTO.getDeviceName(), user.getFamily());
    //     if (matchDevices == null || matchDevices.isEmpty()) {
    //         return ResponseEntity.badRequest().body("Device not found in the family!");
    //     }

    //     for (Device device : matchDevices) {
    //         device.setOnOff(device.getOnOff() == OnOff.On ? OnOff.Off : OnOff.On);
    //     }
        
    //     deviceRepo.saveAll(matchDevices);

    //     return ResponseEntity.ok("Status Changed!");
    // }
    
    // DONE
    @GetMapping("/getDeviceRoom")
    public ResponseEntity<?> getDevicesByRoom(@RequestHeader("Authorization") String token, @RequestBody AddNewDeviceDTO addNewDeviceDTO) {
        
        // Token Verification
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        // Find the user object
        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }
        
        // Get the user's family
        Family userFamily = user.getFamily();
        if (userFamily == null) {
        return ResponseEntity.badRequest().body("User does not belong to any family!");
        }

        // Get the room
        Room room = roomRepo.findByRoomName(addNewDeviceDTO.getRoomName());
        
        List<Device> matchDevices = deviceRepo.findByFamilyAndRoom(userFamily, room);

        List<DeviceRoomDTO> deviceList = matchDevices.stream()
            .map(DeviceRoomDTO::new)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(deviceList);
    }

    // DONE
    @GetMapping("/getAllDevice") 
    public ResponseEntity<?> getAllDevice(@RequestHeader("Authorization") String token){
        
        // Token Verification
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        // Find the user object
        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        // Get the user's family
        Family userFamily = user.getFamily();
        if (userFamily == null) {
        return ResponseEntity.badRequest().body("User does not belong to any family!");
        }

        List<Device> devices = deviceRepo.findByFamily(userFamily);
        
        return ResponseEntity.ok(devices);
    }

    // DONE
    @DeleteMapping("/deleteDevice") 
    public ResponseEntity<?> deleteDevice(@RequestHeader("Authorization") String token, @RequestBody DeviceNameDTO deviceNameDTO){
        
        // Token Verification
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        // Find the user object
        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        if (user.getRole().name().equals("User")) {
            return ResponseEntity.badRequest().body("Access Denied!");
        }

        /* Match device in database, with the device name given and user's family, make sure return the device in the user's family, because may have duplicate device name */
        Device matchDevice = deviceRepo.findByDeviceNameAndFamily(deviceNameDTO.getDeviceName(), user.getFamily());
        if (matchDevice == null) {
            return ResponseEntity.badRequest().body("Device not found in the family!");
        }

        deviceRepo.delete(matchDevice);

        return ResponseEntity.ok("Device deleted successfully!");
    }

    // DONE
    @PutMapping("/updateDevice")
    public ResponseEntity<?> updateDevice(@RequestHeader("Authorization") String token, @RequestBody UpdateDeviceDTO updateDeviceDTO){
        
        // Token Verification
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        // Find the user object
        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        /* Match device in database, with the device name given and user's family, make sure return the device in the user's family, because may have duplicate device name */
        Device matchDevice = deviceRepo.findByDeviceNameAndFamily(updateDeviceDTO.getDeviceName(), user.getFamily());
        if (matchDevice == null) {
            return ResponseEntity.badRequest().body("Device not found in the family!");
        }

        if (user.getRole().name().equals("User")) {
            return ResponseEntity.badRequest().body("Access Denied!");
        }

        if (updateDeviceDTO.getDeviceName() != null) {
            matchDevice.setDeviceName(updateDeviceDTO.getDeviceName());
        }

        if (updateDeviceDTO.getOnOff() != null) {
            matchDevice.setOnOff(updateDeviceDTO.getOnOff());
        }

        if (updateDeviceDTO.getPicture() != null) {
            matchDevice.setPicture(updateDeviceDTO.getPicture());
        }

        deviceRepo.save(matchDevice);

        return ResponseEntity.ok("Device updated successfully!");
    }

    @PostMapping("/setAction")
    public ResponseEntity<?> setAction(@RequestHeader("Authorization") String token, @RequestBody EmailDTO emailDTO){
        return null;
        //what should set action do
    }
}


