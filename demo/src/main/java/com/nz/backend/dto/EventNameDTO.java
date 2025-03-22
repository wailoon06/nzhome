package com.nz.backend.dto;

public class EventNameDTO {
    private String title;
    private Long eventid;
    private Long deviceid;

    public EventNameDTO() {
    }

    public EventNameDTO(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getEventid() {
        return eventid;
    }

    public void setEventid(Long eventid) {
        this.eventid = eventid;
    }

    public Long getDeviceId() {
        return deviceid;
    }

    public void setDeviceId(Long deviceid) {
        this.deviceid = deviceid;
    }
}
