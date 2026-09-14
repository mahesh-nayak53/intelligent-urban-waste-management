import { useEffect, useEffectEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus2, LocateFixed, X } from "lucide-react";
import ComplaintTracker from "../../components/citizen/ComplaintTracker";
import CitizenStatsCards from "../../components/citizen/CitizenStatsCards";
import NotificationPanel from "../../components/citizen/NotificationPanel";
import ProfileCard from "../../components/citizen/ProfileCard";
import {
  createComplaint,
  getCitizenDashboard,
  getCitizenProfile,
  updateCitizenProfile,
  uploadComplaintImage,
} from "../../services/citizenPortalService";
import { deleteNotification, markNotificationRead } from "../../services/notificationService";
import "../../components/citizen/CitizenPortal.css";

const emptyComplaint = {
  title: "",
  description: "",
  zone: "",
  priority: "MEDIUM",
  latitude: "",
  longitude: "",
  photoUrl: "",
};

function CitizenDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintForm, setComplaintForm] = useState(emptyComplaint);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [editingProfile, setEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadPortal = async () => {
    setLoading(true);
    setError("");
    try {
      const [portalData, profileData] = await Promise.all([
        getCitizenDashboard(),
        getCitizenProfile(),
      ]);
      setDashboard(portalData);
      setProfile(profileData);
      setProfileForm({ name: profileData.name || "", email: profileData.email || "", phone: profileData.phone || "" });
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to load your portal.");
    } finally {
      setLoading(false);
    }
  };

  const loadPortalEvent = useEffectEvent(loadPortal);
  useEffect(() => {
    const request = setTimeout(() => loadPortalEvent(), 0);
    return () => clearTimeout(request);
  }, []);

  const updateComplaintField = (field, value) => setComplaintForm((current) => ({ ...current, [field]: value }));

  const locateCitizen = () => {
    if (!navigator.geolocation) {
      setError("Location is not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => setComplaintForm((current) => ({ ...current, latitude: position.coords.latitude, longitude: position.coords.longitude })),
      () => setError("Location permission was not granted. You can still try again later."),
    );
  };

  const handleImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadComplaintImage(file);
      updateComplaintField("photoUrl", result.url);
    } catch (requestError) {
      setError(requestError.message || "Unable to upload this image.");
    } finally {
      setUploading(false);
    }
  };

  const submitComplaint = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createComplaint({ ...complaintForm, latitude: Number(complaintForm.latitude), longitude: Number(complaintForm.longitude) });
      setComplaintForm(emptyComplaint);
      setModal("");
      await loadPortal();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to submit complaint.");
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await updateCitizenProfile(profileForm);
      setProfile(updated);
      setEditingProfile(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const complaints = dashboard?.complaints || [];
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  const markCitizenNotificationRead = async (id) => {
    const updated = await markNotificationRead(id);
    setDashboard((current) => ({ ...current, notifications: current.notifications.map((item) => item.id === updated.id ? updated : item) }));
  };
  const dismissCitizenNotification = async (id) => {
    await deleteNotification(id);
    setDashboard((current) => ({ ...current, notifications: current.notifications.filter((item) => item.id !== id) }));
  };

  return (
    <div className="citizen-dashboard">
      <div className="citizen-shell">
        <header className="citizen-header">
          <div>
            <span className="citizen-eyebrow">CleanCity citizen portal</span>
            <h1>Hello, {profile?.name || localStorage.getItem("name") || "neighbor"}</h1>
            <p>Report issues, follow progress, and help keep your neighborhood clean.</p>
          </div>
          <div className="citizen-header-actions">
            <button type="button" className="secondary-action" onClick={loadPortal}>Refresh</button>
            <button type="button" className="primary-action" onClick={() => setModal("complaint")}><FilePlus2 size={17} /> Report an issue</button>
            <button type="button" className="secondary-action" onClick={logout}>Sign out</button>
          </div>
        </header>

        {error && <div className="citizen-error" role="alert">{error}</div>}
        <CitizenStatsCards stats={dashboard?.stats} loading={loading} />

        <div className="citizen-layout">
          <section className="citizen-panel complaints-panel">
            <div className="citizen-panel-heading"><div><span className="citizen-eyebrow">Your activity</span><h2>My complaints</h2></div><span className="citizen-muted">{complaints.length} reports</span></div>
            {loading ? <div className="citizen-empty">Loading your complaints...</div> : complaints.length ? <div className="complaints-list">{complaints.map((complaint) => <ComplaintTracker key={complaint.id} complaint={complaint} onSelect={(item) => { setSelectedComplaint(item); setModal("tracking"); }} />)}</div> : <div className="citizen-empty"><FilePlus2 size={27} /><h3>No complaints yet</h3><p>Your submitted reports will appear here.</p><button type="button" className="primary-action" onClick={() => setModal("complaint")}>Submit your first report</button></div>}
          </section>
          <div className="citizen-side-column"><NotificationPanel notifications={dashboard?.notifications} onRead={markCitizenNotificationRead} onDismiss={dismissCitizenNotification} /><ProfileCard profile={profile} editing={editingProfile} form={profileForm} onChange={(field, value) => setProfileForm((current) => ({ ...current, [field]: value }))} onEdit={() => setEditingProfile(true)} onCancel={() => setEditingProfile(false)} onSave={saveProfile} saving={saving} /></div>
        </div>
      </div>

      {modal === "complaint" && <div className="citizen-modal-backdrop"><section className="citizen-modal"><div className="citizen-panel-heading"><div><span className="citizen-eyebrow">New report</span><h2>Report a neighborhood issue</h2></div><button type="button" className="text-action" onClick={() => setModal("")} title="Close"><X size={20} /></button></div><form className="complaint-form" onSubmit={submitComplaint}><label>Title<input required value={complaintForm.title} onChange={(event) => updateComplaintField("title", event.target.value)} placeholder="What needs attention?" /></label><label>Zone<input required value={complaintForm.zone} onChange={(event) => updateComplaintField("zone", event.target.value)} placeholder="e.g. Zone A" /></label><label>Description<textarea required rows="4" value={complaintForm.description} onChange={(event) => updateComplaintField("description", event.target.value)} placeholder="Describe the issue clearly" /></label><label>Priority<select value={complaintForm.priority} onChange={(event) => updateComplaintField("priority", event.target.value)}><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select></label><label className="file-label">Photo<input type="file" accept="image/*" onChange={handleImage} disabled={uploading} />{uploading && <small>Uploading image...</small>}{complaintForm.photoUrl && <small>Image attached</small>}</label><label className="location-field">Location<button type="button" className="secondary-action" onClick={locateCitizen}><LocateFixed size={15} /> Use my location</button><small>{complaintForm.latitude ? `${complaintForm.latitude}, ${complaintForm.longitude}` : "Location is required to route your report."}</small></label><div className="form-actions"><button type="button" className="secondary-action" onClick={() => setModal("")}>Cancel</button><button type="submit" className="primary-action" disabled={saving || uploading || !complaintForm.latitude || !complaintForm.longitude}>{saving ? "Submitting..." : "Submit complaint"}</button></div></form></section></div>}

      {modal === "tracking" && selectedComplaint && <div className="citizen-modal-backdrop"><section className="citizen-modal tracking-modal"><header><div><span className="citizen-eyebrow">Complaint #{selectedComplaint.id}</span><h2>{selectedComplaint.title}</h2></div><button type="button" className="text-action" onClick={() => setModal("")} title="Close"><X size={20} /></button></header><p className="tracking-detail">{selectedComplaint.description}</p>{selectedComplaint.assignedStaffName && <div className="assigned-staff"><strong>Assigned staff:</strong> {selectedComplaint.assignedStaffName}{selectedComplaint.assignedStaffPhone ? ` · ${selectedComplaint.assignedStaffPhone}` : ""}</div>}<div className="tracking-timeline">{selectedComplaint.timeline?.map((step) => <div className={`tracking-event ${step.complete ? "complete" : ""}`} key={step.label}><span>{step.complete ? "✓" : ""}</span><div><strong>{step.label}</strong><small>{step.detail}{step.timestamp ? ` · ${new Date(step.timestamp).toLocaleString()}` : ""}</small></div></div>)}</div><button type="button" className="secondary-action" onClick={() => setModal("")}>Close tracking</button></section></div>}
    </div>
  );
}

export default CitizenDashboard;