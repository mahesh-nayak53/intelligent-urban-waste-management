package backend;

import backend.dto.DashboardResponseDTO;
import backend.dto.TaskStatsDTO;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DashboardApiContractTest {

    @Test
    void dashboardResponseShouldExposeFrontendDashboardFields() {
        DashboardResponseDTO dto = new DashboardResponseDTO();
        dto.setTotalComplaints(12);
        dto.setPendingComplaints(3);
        dto.setResolvedComplaints(7);
        dto.setTotalStaff(9);
        dto.setStaffMembers(9);

        assertEquals(12, dto.getTotalComplaints());
        assertEquals(3, dto.getPendingComplaints());
        assertEquals(7, dto.getResolvedComplaints());
        assertEquals(9, dto.getTotalStaff());
        assertEquals(9, dto.getStaffMembers());
    }

    @Test
    void taskStatsShouldExposeFrontendTaskSummaryFields() {
        TaskStatsDTO dto = new TaskStatsDTO();
        dto.setTotalTasks(10L);
        dto.setAssignedTasks(4L);
        dto.setCompletedTasks(3L);
        dto.setPendingTasks(2L);
        dto.setInProgressTasks(5L);

        assertEquals(10L, dto.getTotalTasks());
        assertEquals(4L, dto.getAssignedTasks());
        assertEquals(3L, dto.getCompletedTasks());
        assertEquals(2L, dto.getPendingTasks());
        assertEquals(5L, dto.getInProgressTasks());
    }
}
