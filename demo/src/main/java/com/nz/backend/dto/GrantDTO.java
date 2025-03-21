package com.nz.backend.dto;

import java.util.List;

public class GrantDTO {
    private List<Long> userid;
    private Long roomid;

    public GrantDTO() {
    }
    
    
    public GrantDTO(List<Long> userid, Long roomid) {
        this.userid = userid;
        this.roomid = roomid;
    }
    
    // Getters and setters
    public List<Long> getUserid() {
        return userid;
    }
    
    public void setUserid(List<Long> userid) {
        this.userid = userid;
    }
    
    public Long getRoomid() {
        return roomid;
    }
    
    public void setRoomid(Long roomid) {
        this.roomid = roomid;
    }
}
