import { useEffect, useMemo, useState } from "react";
import { Users, UserPlus, Search, RefreshCw, Filter, X } from "lucide-react";

import StaffCard from "../../../components/admin/Staff/StaffCard";
import StaffProfile from "../../../components/admin/Staff/StaffProfile";
import {
  getStaffMembers,
  createStaff,
  updateStaff,
  toggleStaffAvailability,
} from "../../../services/staffManagementService";

function StaffManagementPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    zone: "",
    available: true,
  });

  const loadStaff = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStaffMembers();
      setStaff(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Unable to load staff members. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const departments = useMemo(() => {
    return [
      ...new Set(staff.map((member) => member.department).filter(Boolean)),
    ];
  }, [staff]);

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();

    return staff.filter((member) => {
      const matchesSearch =
        !query ||
        member.name?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query) ||
        member.department?.toLowerCase().includes(query) ||
        member.zone?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && member.available === true) ||
        (statusFilter === "INACTIVE" && member.available === false);

      const matchesDepartment =
        departmentFilter === "ALL" || member.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [staff, search, statusFilter, departmentFilter]);

  const stats = useMemo(() => {
    const total = staff.length;
    const active = staff.filter((member) => member.available).length;
    const inactive = total - active;

    const activeTasks = staff.reduce(
      (sum, member) => sum + Number(member.assignedTasks || 0),
      0,
    );

    return {
      total,
      active,
      inactive,
      activeTasks,
    };
  }, [staff]);

  const openCreateForm = () => {
    setEditingStaff(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      department: "",
      zone: "",
      available: true,
    });

    setShowForm(true);
  };

  const openEditForm = (member) => {
    setEditingStaff(member);

    setForm({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      department: member.department || "",
      zone: member.zone || "",
      available: member.available ?? true,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingStaff(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingStaff) {
        await updateStaff(editingStaff.id, form);
      } else {
        await createStaff(form);
      }

      await loadStaff();
      closeForm();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Unable to save staff member. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (member) => {
    try {
      setError("");

      await toggleStaffAvailability(member.id, !member.available);

      await loadStaff();

      if (selectedStaff?.id === member.id) {
        setSelectedStaff((previous) =>
          previous
            ? {
                ...previous,
                available: !member.available,
              }
            : previous,
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message || "Unable to update staff availability.",
      );
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setDepartmentFilter("ALL");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <Users size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Staff Management
                </h1>

                <p className="text-sm text-slate-500">
                  Manage your operations team, availability, zones and workload.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadStaff}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <UserPlus size={17} />
              Add Staff
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 rounded-lg p-1 transition hover:bg-red-100"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total staff</p>

            <div className="mt-3 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-900">
                {stats.total}
              </h2>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Available staff
            </p>

            <div className="mt-3 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-900">
                {stats.active}
              </h2>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Users size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Unavailable staff
            </p>

            <div className="mt-3 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-900">
                {stats.inactive}
              </h2>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Users size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Active tasks</p>

            <div className="mt-3 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-900">
                {stats.activeTasks}
              </h2>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Filter size={20} />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_200px_auto]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search staff by name, email, department or zone"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="ALL">All status</option>
              <option value="ACTIVE">Available</option>
              <option value="INACTIVE">Unavailable</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="ALL">All departments</option>

              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <X size={16} />
              Clear
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredStaff.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {staff.length}
              </span>{" "}
              staff members
            </p>
          </div>
        </section>

        {/* Staff Grid */}
        {loading ? (
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-200" />

                  <div className="flex-1">
                    <div className="h-4 w-32 rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-24 rounded bg-slate-200" />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="h-14 rounded-xl bg-slate-100" />
                  <div className="h-14 rounded-xl bg-slate-100" />
                  <div className="h-14 rounded-xl bg-slate-100" />
                </div>

                <div className="mt-5 h-9 rounded-lg bg-slate-100" />
              </div>
            ))}
          </section>
        ) : filteredStaff.length > 0 ? (
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredStaff.map((member) => (
              <StaffCard
                key={member.id}
                member={member}
                onView={setSelectedStaff}
                onEdit={openEditForm}
                onToggle={handleToggle}
              />
            ))}
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Users size={25} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No staff members found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Try changing your search or filters, or add a new staff member.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <UserPlus size={17} />
              Add Staff
            </button>
          </section>
        )}

        {/* Staff Profile Modal */}
        {selectedStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Staff Profile
                  </h2>

                  <p className="text-sm text-slate-500">
                    View staff details and performance.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStaff(null)}
                  className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 sm:p-6">
                <StaffProfile
                  staff={selectedStaff}
                  onClose={() => setSelectedStaff(null)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingStaff ? "Edit Staff Member" : "Add Staff Member"}
                  </h2>

                  <p className="text-sm text-slate-500">
                    Enter the staff member's operational details.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      placeholder="Enter name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Phone
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Department
                    </label>

                    <input
                      type="text"
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      placeholder="Operations"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Zone
                    </label>

                    <input
                      type="text"
                      name="zone"
                      value={form.zone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      placeholder="Enter zone"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        name="available"
                        checked={form.available}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />

                      <span className="text-sm font-semibold text-slate-700">
                        Available for assignments
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving && <RefreshCw size={16} className="animate-spin" />}

                    {saving
                      ? "Saving..."
                      : editingStaff
                        ? "Update Staff"
                        : "Create Staff"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffManagementPage;
