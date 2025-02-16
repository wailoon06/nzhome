package com.example.demo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestDBConnection {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://ep-silent-mouse-a1s1q88r-pooler.ap-southeast-1.aws.neon.tech:5432/nzhome?sslmode=require";
                        
        String user = "neondb_owner";  // Use the correct username
        String password = "npg_IA5uU6QFleiV";  // Use the correct password

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            if (conn != null) {
                System.out.println("Connected to the database!");
            } else {
                System.out.println("Failed to make connection!");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
