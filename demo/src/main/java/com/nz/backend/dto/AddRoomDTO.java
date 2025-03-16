package com.nz.backend.dto;

public class AddRoomDTO {
    private String roomName;

    public AddRoomDTO(){}

    public AddRoomDTO(String roomName){
        this.roomName = roomName;
    }

    public String getRoomName(){
        return roomName;
    }

    public void setRoomName(String roomName){
        this.roomName = roomName;
    }

}
