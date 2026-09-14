package backend.repository;

import backend.entity.PasswordResetOtp;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {
    Optional<PasswordResetOtp> findTopByEmailAndUsedFalseOrderByIdDesc(String email);
}
