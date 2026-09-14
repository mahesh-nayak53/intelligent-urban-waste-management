import { useEffect, useEffectEvent, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Plus,
  RefreshCw,
  Users,
  X,
  AlertCircle,
} from "lucide-react";

import AdminLayout from "../../../layouts/AdminLayout";
import StaffTable from "../../../components/admin/Staff/StaffTable";
import StaffCard from "../../../components/admin/Staff/StaffCard";
import StaffProfile from "../../../components/admin/Staff/StaffProfile";

import {
  createManagedStaff,
  getManagedStaffProfile,
  listManagedStaff,
  updateManagedStaff,
  updateManagedStaffAvailability,
} from "../../../services/staffManagementService";

const initialFilters = {
  search: "",
  department: "",
  zone: "",
  available: "",
  page: 0,
  size: 10,
  sortBy: "name",
  sortDirection: "asc",
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  department: "",
  zone: "",
  available: true,
};

function StaffManagementPage() {
  const [filters, setFilters] = useState(initialFilters);

  const [staff, setStaff] = useState([]);

  const [pagination, setPagination] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modal, setModal] = useState({
    type: "",
    member: null,
    profile: null,
  });

  const [form, setForm] = useState(emptyForm);

  const loadStaff = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await listManagedStaff({
        ...filters,
        available:
          filters.available === "" ? undefined : filters.available,
      });

      setStaff(result.content || []);

      setPagination({
        page: result.page || 0,
        totalPages: result.totalPages || 0,
        totalElements: result.totalElements || 0,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load staff."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadStaffEvent = useEffectEvent(loadStaff);

  useEffect(() => {
    const request = setTimeout(() => {
      loadStaffEvent();
    }, 0);

    return () => clearTimeout(request);
  }, [filters]);

  const changeFilter = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
      page: field === "page" ? value : 0,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const openForm = (type, member = null) => {
    setForm(
      member
        ? {
            name: member.name || "",
            email: member.email || "",
            password: "",
            phone: member.phone || "",
            department: member.department || "",
            zone: member.zone || "",
            available: member.available !== false,
          }
        : { ...emptyForm }
    );

    setModal({
      type,
      member,
      profile: null,
    });
  };

  const openProfile = async (member) => {
    setModal({
      type: "profile-loading",
      member,
      profile: null,
    });

    try {
      const profile = await getManagedStaffProfile(member.id);

      setModal({
        type: "profile",
        member,
        profile,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load profile."
      );

      setModal({
        type: "",
        member: null,
        profile: null,
      });
    }
  };

  const closeModal = () => {
    setModal({
      type: "",
      member: null,
      profile: null,
    });
  };

  const saveStaff = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (modal.type === "create") {
        await createManagedStaff(form);
      } else {
        await updateManagedStaff(modal.member.id, form);
      }

      closeModal();
      await loadStaff();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to save staff."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (member) => {
    try {
      await updateManagedStaffAvailability(
        member.id,
        !member.available
      );

      await loadStaff();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to update staff availability."
      );
    }
  };

  const summary = [
    {
      label: "Total staff",
      value: pagination.totalElements,
      icon: Users,
      iconStyle: "bg-blue-50 text-blue-600",
      accent: "bg-blue-600",
    },
    {
      label: "Active staff",
      value: staff.filter((member) => member.available).length,
      icon: CheckCircle2,
      iconStyle: "bg-green-50 text-green-600",
      accent: "bg-green-600",
    },
    {
      label: "Departments",
      value: new Set(
        staff
          .map((member) => member.department)
          .filter(Boolean)
      ).size,
      icon: BriefcaseBusiness,
      iconStyle: "bg-violet-50 text-violet-600",
      accent: "bg-violet-600",
    },
  ];

  return (
    <AdminLayout>
      <main className="mx-auto w-full max-w-[1600px]">
        {/* Page Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                  People
                </span>

                <span className="text-sm text-slate-400">/</span>

                <span className="text-sm font-medium text-slate-500">
                  Staff directory
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Staff management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage field teams, availability, and operational
                performance from one place.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={loadStaff}
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => openForm("create")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
              >
                <Plus size={18} />
                Add staff
              </button>
            </div>
          </div>
        </header>

        {/* Summary Cards */}
        <section
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
          aria-label="Staff summary"
        >
          {summary.map(
            ({
              label,
              value,
              icon: Icon,
              iconStyle,
              accent,
            }) => (
              <article
                key={label}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className={`absolute left-0 top-0 h-1 w-full ${accent}`}
                />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {label}
                    </p>

                    <div className="mt-3">
                      {loading ? (
                        <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
                      ) : (
                        <p className="text-3xl font-bold tracking-tight text-slate-900">
                          {value ?? 0}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition duration-200 group-hover:scale-105 ${iconStyle}`}
                  >
                    <Icon size={21} strokeWidth={2} />
                  </div>
                </div>

                <div className="mt-5 h-1 w-10 rounded-full bg-slate-100 transition-all duration-300 group-hover:w-16" />
              </article>
            )
          )}
        </section>

        {/* Directory */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Users size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Staff directory
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-500">
                    {pagination.totalElements}{" "}
                    {pagination.totalElements === 1
                      ? "team member"
                      : "team members"}
                  </p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/* Search */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Search
                </span>

                <input
                  value={filters.search}
                  onChange={(event) =>
                    changeFilter("search", event.target.value)
                  }
                  placeholder="Name, email, department"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </label>

              {/* Department */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Department
                </span>

                <input
                  value={filters.department}
                  onChange={(event) =>
                    changeFilter(
                      "department",
                      event.target.value
                    )
                  }
                  placeholder="All departments"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </label>

              {/* Zone */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Zone
                </span>

                <input
                  value={filters.zone}
                  onChange={(event) =>
                    changeFilter("zone", event.target.value)
                  }
                  placeholder="All zones"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </label>

              {/* Status */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </span>

                <select
                  value={filters.available}
                  onChange={(event) =>
                    changeFilter(
                      "available",
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="">All staff</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </label>
            </div>

            {/* Reset Filters */}
            {(filters.search ||
              filters.department ||
              filters.zone ||
              filters.available) && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mx-5 mt-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:mx-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <p className="font-semibold">
                    Something went wrong
                  </p>

                  <p className="mt-1 text-red-600">
                    {error}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={loadStaff}
                className="w-fit rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="p-6">
              <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:block">
                <div className="h-12 animate-pulse bg-slate-100" />

                <div className="divide-y divide-slate-100">
                  {Array.from({ length: 6 }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-5 p-5"
                      >
                        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
                        <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
                        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                        <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                        <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-4 md:hidden">
                {Array.from({ length: 4 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-40 animate-pulse rounded-xl bg-slate-100"
                    />
                  )
                )}
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
                <RefreshCw
                  size={16}
                  className="animate-spin"
                />
                Loading staff directory...
              </div>
            </div>
          ) : staff.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Users size={30} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No staff members found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Adjust your filters or add a new team member to
                get started.
              </p>

              <button
                type="button"
                onClick={() => openForm("create")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus size={17} />
                Add staff
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <StaffTable
                  staff={staff}
                  onView={openProfile}
                  onEdit={(member) =>
                    openForm("edit", member)
                  }
                  onToggle={toggleAvailability}
                />
              </div>

              {/* Mobile Cards */}
              <div className="space-y-4 p-4 md:hidden">
                {staff.map((member) => (
                  <StaffCard
                    key={member.id}
                    member={member}
                    onView={openProfile}
                    onEdit={(item) =>
                      openForm("edit", item)
                    }
                    onToggle={toggleAvailability}
                  />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-700">
                  {pagination.page + 1}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {pagination.totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    changeFilter(
                      "page",
                      pagination.page - 1
                    )
                  }
                  disabled={pagination.page === 0}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeFilter(
                      "page",
                      pagination.page + 1
                    )
                  }
                  disabled={
                    pagination.page + 1 >=
                    pagination.totalPages
                  }
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Profile Loading Modal */}
        {modal.type === "profile-loading" && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <RefreshCw
                  size={22}
                  className="animate-spin"
                />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Loading profile
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Fetching staff information...
              </p>
            </div>
          </div>
        )}

        {/* Profile Modal */}
        {modal.type === "profile" && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
            <section className="relative my-8 w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <button
                type="button"
                onClick={closeModal}
                title="Close"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
              >
                <X size={18} />
              </button>

              <StaffProfile profile={modal.profile} />
            </section>
          </div>
        )}

        {/* Create / Edit Modal */}
        {(modal.type === "create" ||
          modal.type === "edit") && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
            <section
              className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
              role="dialog"
              aria-modal="true"
            >
              {/* Modal Header */}
              <header className="flex items-start justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    People operations
                  </span>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {modal.type === "create"
                      ? "Add staff member"
                      : `Edit ${modal.member.name}`}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {modal.type === "create"
                      ? "Create a new operational team member."
                      : "Update this staff member's information."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  title="Close"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <X size={18} />
                </button>
              </header>

              {/* Form */}
              <form
                className="p-5 sm:p-6"
                onSubmit={saveStaff}
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Full name
                    </span>

                    <input
                      required
                      value={form.name}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          name: event.target.value,
                        })
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </label>

                  {/* Email */}
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Work email
                    </span>

                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          email: event.target.value,
                        })
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </label>

                  {/* Password */}
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Login password
                    </span>

                    <input
                      required={modal.type === "create"}
                      minLength={6}
                      type="password"
                      value={form.password}
                      placeholder={
                        modal.type === "create"
                          ? "Set login password"
                          : "Leave blank to keep current password"
                      }
                      onChange={(event) =>
                        setForm({
                          ...form,
                          password: event.target.value,
                        })
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </label>

                  {/* Phone */}
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Phone
                    </span>

                    <input
                      value={form.phone}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          phone: event.target.value,
                        })
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </label>

                  {/* Department */}
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Department
                    </span>

                    <input
                      value={form.department}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          department: event.target.value,
                        })
                      }
                      placeholder="Operations"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </label>

                  {/* Zone */}
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Zone
                    </span>

                    <input
                      value={form.zone}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          zone: event.target.value,
                        })
                      }
                      placeholder="Zone A"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </label>

                  {/* Availability */}
                  <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.available}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          available: event.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-slate-700">
                        Active and available
                      </span>

                      <span className="block text-xs text-slate-500">
                        Staff member can receive assignments.
                      </span>
                    </span>
                  </label>
                </div>

                {/* Footer */}
                <footer className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving && (
                      <RefreshCw
                        size={16}
                        className="animate-spin"
                      />
                    )}

                    {saving ? "Saving..." : "Save staff"}
                  </button>
                </footer>
              </form>
            </section>
          </div>
        )}
      </main>
    </AdminLayout>
  );
}

export default StaffManagementPage;