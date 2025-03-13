package com.nz.backend.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
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
import com.nz.backend.dto.EmailDTO;
import com.nz.backend.dto.UpdateDeviceDTO;
import com.nz.backend.entities.Device;
import com.nz.backend.entities.Family;
import com.nz.backend.entities.User;
import com.nz.backend.enums.OnOff;
import com.nz.backend.repo.DeviceRepo;
import com.nz.backend.repo.UsersRepository;
import com.nz.backend.services.JwtService;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class DeviceControllers {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private DeviceRepo deviceRepo;

    @Autowired
    private JwtService jwtService;

    @Value("${jwt.secret.key}")
    private String secretKey;


    @GetMapping("/getDevice")
    public ResponseEntity<?> getDevicesByRoom(@RequestHeader("Authorization") String token, @RequestBody EmailDTO emailDTO) {
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);
        User owner = usersRepository.findByEmail(email);

        String targetEmail = emailDTO.getEmail();
        User matchUser = usersRepository.findByEmail(targetEmail);

        if (!owner.getFamily().equals(matchUser.getFamily())) {
            return ResponseEntity.badRequest().body("You don't have access!");
        }
        if (!owner.getFamily().equals(matchUser.getFamily())) {
            return ResponseEntity.badRequest().body("You don't have access!");
        }

        else {
            //continue later
        }


        return null;
    }

    @GetMapping("/getDeviceDetails") //done
    public ResponseEntity<?> getDevicesDetails(@RequestHeader("Authorization") String token, @RequestBody DeviceNameDTO deviceNameDTO) {

        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);
        
        User owner = usersRepository.findByEmail(email); 
        if (owner == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Device matchDevice = deviceRepo.findByDeviceName(deviceNameDTO.getDeviceName());

        Map<String, Object> response = new HashMap<>();
        response.put("device_name", matchDevice.getDeviceName());
        response.put("created_by", matchDevice.getCreatedBy());
        response.put("created_time", matchDevice.getCreatedTime());
        response.put("warranty_expiration", matchDevice.getWarrantyExp());
      
        return ResponseEntity.ok(response);
    }

    @PutMapping("/OnOff") //done
    public ResponseEntity<?> turnOnOff (@RequestHeader("Authorization") String token, @RequestBody EmailDTO emailDTO, @RequestBody DeviceNameDTO devicenameDTO, @RequestBody DeviceOnOffDTO deviceonoffDTO){
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);
        User owner = usersRepository.findByEmail(email);

        String targetEmail = emailDTO.getEmail();
        User matchUser = usersRepository.findByEmail(targetEmail);

        Device deviceStatus = deviceRepo.findByDeviceName(devicenameDTO.getDeviceName());

        if (owner == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if (!owner.getFamily().equals(matchUser.getFamily())) {
            return ResponseEntity.badRequest().body("You don't have access!");
        }
        
        if(deviceStatus.getOnOff() == OnOff.On){
            deviceStatus.setOnOff(OnOff.Off);
        }

        else {
            deviceStatus.setOnOff(OnOff.On);
        }

        deviceRepo.save(deviceStatus);
        
        return ResponseEntity.ok("Status Changed.");
    }

    @PostMapping("/addDevice") //done
    public ResponseEntity<?> addNewDevices(@RequestHeader("Authorization") String token, @RequestBody EmailDTO emailDTO, @RequestBody AddNewDeviceDTO addNewDeviceDTO){
        
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);
        User owner = usersRepository.findByEmail(email);

        String targetEmail = emailDTO.getEmail();
        User matchUser = usersRepository.findByEmail(targetEmail);

        
        if (!owner.getFamily().equals(matchUser.getFamily())) {
            return ResponseEntity.badRequest().body("You don't have access!");
        }

        if(addNewDeviceDTO.getDeviceName() == null || addNewDeviceDTO.getBrand() == null 
            || addNewDeviceDTO.getCreatedBy() == null || addNewDeviceDTO.getWarrantyExp() == null){
            return ResponseEntity.badRequest().body("All fields are required!");
        }

        Device newDevice = new Device(
            addNewDeviceDTO.getDeviceName(),
            addNewDeviceDTO.getBrand(),
            addNewDeviceDTO.getCreatedBy(),
            addNewDeviceDTO.getWarrantyExp(),
            addNewDeviceDTO.getPicture()
        );

        deviceRepo.save(newDevice);

        return ResponseEntity.ok("Successfully Added!");

    }

    @PostMapping("/setAction")
    public ResponseEntity<?> setAction(@RequestHeader("Authorization") String token, @RequestBody EmailDTO emailDTO){
        return null;
        //what should set action do
    }

    @GetMapping("/getAllDevice") //done
    public ResponseEntity<?> getAllDevice(@RequestHeader("Authorization") String token){
        
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);
        User owner = usersRepository.findByEmail(email);

        Family userFamily = owner.getFamily();

        if (userFamily == null) {
        return ResponseEntity.badRequest().body("User does not belong to any family!");
        }

        List<Device> devices = deviceRepo.findByFamilyFamilyName(userFamily.getFamilyName());

        return ResponseEntity.ok(devices);
        
    }

    @DeleteMapping("/deleteDevice") //done
    public ResponseEntity<?> deleteDevice(@RequestHeader("Authorization") String token, @RequestBody DeviceNameDTO devicenameDTO){
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);
        User owner = usersRepository.findByEmail(email);

        Device dltDevice = deviceRepo.findByDeviceName(devicenameDTO.getDeviceName());

        if(owner.getEmail() == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found!");
        }

        if(dltDevice == null){
            return ResponseEntity.badRequest().body("Device not available!");
        }

        deviceRepo.delete(dltDevice);

        return ResponseEntity.ok("Device deleted successfully!");
    }

    @PutMapping("updateDevice") //done
    public ResponseEntity<?> updateDevice(@RequestHeader("Authorization") String token, @RequestBody DeviceNameDTO devicenameDTO, @RequestBody UpdateDeviceDTO updatedeviceDTO){
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);
        User owner = usersRepository.findByEmail(email);

        Device device = deviceRepo.findByDeviceName(devicenameDTO.getDeviceName());


        if (owner == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found!");
        }

        if (device.getDeviceName() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Device not found!");
        }

        if (!device.getFamily().equals(owner.getFamily())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission!");
        }

        else {
            if(updatedeviceDTO.getDeviceName() != null){
                device.setDeviceName(updatedeviceDTO.getDeviceName());
            }

            if(updatedeviceDTO.getOnOff() != null){
                device.setOnOff(updatedeviceDTO.getOnOff());
            }

            if(updatedeviceDTO.getPicture() != null){
                device.setPicture(updatedeviceDTO.getPicture());
            }
        }

        deviceRepo.save(device);

        return ResponseEntity.ok("Device updated successfully!");
    }
}


