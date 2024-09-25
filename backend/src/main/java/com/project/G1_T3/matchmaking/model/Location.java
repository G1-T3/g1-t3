package com.project.G1_T3.matchmaking.model;

public class Location {
    private double latitude;
    private double longitude;

    public Location(double lat, double lng) {
        this.latitude = lat;
        this.longitude = lng;
    }

    // Getters and setters
    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}