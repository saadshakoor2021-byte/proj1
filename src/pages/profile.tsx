import React, { useState } from 'react';
import { loadProfile, saveProfile } from '../lib/storage';
import { Button, Input, Section } from '../ui';

export function MyProfile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(loadProfile);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    saveProfile(profile);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="mx-auto max-w-2xl">
        <Section>
          <h1 className="mb-6 text-3xl font-bold tracking-tight">Edit My Profile</h1>
          <form className="space-y-6" onSubmit={handleSave}>
            <Field label="Full name" value={profile.name} onChange={(name) => setProfile({ ...profile, name })} placeholder="e.g., Muhammad Ahmed" />
            <Field label="Country of citizenship" value={profile.citizenship} onChange={(citizenship) => setProfile({ ...profile, citizenship })} placeholder="e.g., Pakistan" />
            <Field label="Current country of residence" value={profile.residence} onChange={(residence) => setProfile({ ...profile, residence })} placeholder="e.g., Pakistan" />
            <Field label="Qualification type" value={profile.qualification} onChange={(qualification) => setProfile({ ...profile, qualification })} placeholder="e.g., FSc Pre-Engineering" />
            <Field label="Percentage / Grades" value={profile.percentage} onChange={(percentage) => setProfile({ ...profile, percentage })} placeholder="e.g., 85%" />
            <Field label="Intended major" value={profile.intendedMajor} onChange={(intendedMajor) => setProfile({ ...profile, intendedMajor })} placeholder="e.g., Computer Science" />
            <Field label="Annual budget" value={profile.budget} onChange={(budget) => setProfile({ ...profile, budget })} placeholder="e.g., 1500000" />
            <Field label="Preferred destinations" value={profile.preferredDestinations} onChange={(preferredDestinations) => setProfile({ ...profile, preferredDestinations })} placeholder="e.g., Pakistan, Saudi Arabia, Italy" />
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Save</Button>
            </div>
          </form>
        </Section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Section>
        <h1 className="mb-6 text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="mb-4 text-muted-foreground">
          Your profile information helps us match you with suitable universities and scholarships.
        </p>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Info label="Name" value={profile.name} />
            <Info label="Citizenship" value={profile.citizenship} />
            <Info label="Qualification" value={profile.qualification} />
            <Info label="Percentage" value={profile.percentage} />
            <Info label="Intended major" value={profile.intendedMajor} />
            <Info label="Budget" value={profile.budget ? `${profile.budgetCurrency} ${profile.budget}` : ''} />
          </div>
        </div>
        <Button variant="outline" onClick={() => setEditing(true)}>Edit profile</Button>
      </Section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || 'Not set'}</p>
    </div>
  );
}

export default MyProfile;
