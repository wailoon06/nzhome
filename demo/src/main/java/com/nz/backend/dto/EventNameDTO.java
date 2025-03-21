package com.nz.backend.dto;

public class EventNameDTO {
    private String title;
    private Long eventid;

    public EventNameDTO() {
    }

    public EventNameDTO(String title, Long eventid) {
        this.title = title;
        this.eventid = eventid;
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
}
