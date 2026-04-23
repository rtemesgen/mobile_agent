package com.satesoft.mobiagent;

import com.satesoft.mobiagent.auth.AuthService;
import com.satesoft.mobiagent.user.Role;
import com.satesoft.mobiagent.user.User;
import com.satesoft.mobiagent.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class MobiAgentApplication {
    public static void main(String[] args) {
        SpringApplication.run(MobiAgentApplication.class, args);
    }

    @Bean
    CommandLineRunner seedUsers(UserRepository users, AuthService authService) {
        return args -> {
            // Demo users are created only for an empty database so the app can be tested immediately.
            // In production, real users can register or be managed by an admin.
            if (users.count() == 0) {
                users.save(new User("Admin User", "admin@mobi.local", authService.hashPassword("admin123"), Role.ADMIN));
                users.save(new User("Mobi Agent", "agent@mobi.local", authService.hashPassword("agent123"), Role.MOBI_AGENT));
            }
        };
    }
}