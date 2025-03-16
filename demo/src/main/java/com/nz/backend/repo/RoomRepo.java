package com.nz.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nz.backend.entities.Family;
import com.nz.backend.entities.Room;

public interface RoomRepo extends JpaRepository<Room, Long>{
    Room findByRoomName (String roomName);

    Room findByRoomNameAndFamily (String roomName, Family familyid);
}
