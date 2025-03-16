package com.nz.backend.dto;

public class UpdateRoomDTO {
    private String roomName;
    private String image;

    public UpdateRoomDTO (){}

    public UpdateRoomDTO (String roomName, String image){
        this.roomName = roomName;
        this.image = image;
    }

    public String getRoomName (){
        return roomName;
    }

    public void setRoomName (String roomName){
        this.roomName = roomName;
    }

    public String getImage (){
        return image;
    }

    public void setImage (String image){
        this.image = image;
    }
}
