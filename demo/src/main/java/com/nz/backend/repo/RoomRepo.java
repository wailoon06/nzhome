package com.nz.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nz.backend.entities.Family;
import com.nz.backend.entities.Room;

public interface RoomRepo extends JpaRepository<Room, Long>{
    Room findByRoomName (String roomName);

    Room findByRoomNameAndFamily (String roomName, Family familyid);

    List<Room> findByFamily (Family family);
}
