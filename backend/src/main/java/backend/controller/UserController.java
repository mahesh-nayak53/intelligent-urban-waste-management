package backend.controller;

import backend.entity.User;
import backend.service.UserService;
import backend.dto.UserRequestDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(
            UserService userService) {

        this.userService = userService;
    }

 @PostMapping
public User createUser(
        @RequestBody UserRequestDTO dto) {

    return userService.saveUser(dto);

}

    @GetMapping
    public List<User> getAllUsers() {

        return userService.getAllUsers();

    }

}