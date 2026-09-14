package backend.service;


import org.springframework.security.crypto.password.PasswordEncoder;
import backend.entity.User;
import backend.repository.UserRepository;
import backend.dto.UserRequestDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

   public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
}

    public User saveUser(User user) {

        return userRepository.save(user);

    }

    public List<User> getAllUsers() {

        return userRepository.findAll();

    }
    public User saveUser(UserRequestDTO dto) {

    User user = new User();

    user.setName(dto.getName());
    user.setEmail(dto.getEmail());


    user.setPassword(
        passwordEncoder.encode(
                dto.getPassword()
        )
);


    user.setPhone(dto.getPhone());
    user.setRole(dto.getRole());

    return userRepository.save(user);
}

}