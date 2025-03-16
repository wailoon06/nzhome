package com.nz.backend.dto;

public class RoomNameDTO {
    private String roomName;

    public RoomNameDTO (){}

    public RoomNameDTO (String roomName){
        this.roomName = roomName;
    }

    public String getRoomName (){
        return roomName;
    }

    public void setRoomName (String roomName){
        this.roomName = roomName;
    }
}
