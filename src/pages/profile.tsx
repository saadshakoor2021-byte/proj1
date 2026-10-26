import React, { useState } from 'react';
import { loadProfile, saveProfile } from '../lib/storage';
import { Button, Card, Input, Section } from '../ui';

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
          <Card>
            <form className="space-y-6" onSubmit={handleSave}>
              <Field label="Full name" value={profile.name} onChange={(name) => setProfile({ ...profile, name })} placeholder="e.g., Muhammad Ahmed" />
              <Field label="Country of citizenship" value={profile.citizenship} onChange={(citizenship) => setProfile({ ...profile, citizenship })} placeholder="e.g., Pakistan" />
              <Field label="Current country of residence" value={profile.residence} onChange={(residence) => setProfile({ ...profile, residence })} placeholder="e.g., Pakistan" />
              <Field label="Education completed in" value={profile.educationCountry} onChange={(educationCountry) => setProfile({ ...profile, educationCountry })} placeholder="e.g., Pakistan" />
              <Field label="Qualification type" value={profile.qualification} onChange={(qualification) => setProfile({ ...profile, qualification })} placeholder="e.g., FSc Pre-Engineering" />
              <Field label="Percentage / Grades" value={profile.percentage} onChange={(percentage) => setProfile({ ...profile, percentage })} placeholder="e.g., 85%" />
              <Field label="Intended major" value={profile.intendedMajor} onChange={(intendedMajor) => setProfile({ ...profile, intendedMajor })} placeholder="e.g., Computer Science" />
              <Field label="Annual budget" value={profile.budget} onChange={(budget) => setProfile({ ...profile, budget })} placeholder="e.g., 1500000" />
              <Field label="Preferred destinations" value={profile.preferredDestinations} onChange={(preferredDestinations) => setProfile({ ...profile, preferredDestinations })} placeholder="e.g., Pakistan, Saudi Arabia, Italy" />
              
              <div>
                <label className="mb-2 block text-sm font-medium">Standardized Tests</label>
                <div className="flex flex-wrap gap-6 pt-1">
                  <label className="flex items-center gap-2 text-sm">
                    <Input type="checkbox" checked={profile.sat} onChange={(e) => setProfile({ ...profile, sat: e.target.checked })} />
                    SAT
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Input type="checkbox" checked={profile.ielts} onChange={(e) => setProfile({ ...profile, ielts: e.target.checked })} />
                    IELTS
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Input type="checkbox" checked={profile.toefl} onChange={(e) => setProfile({ ...profile, toefl: e.target.checked })} />
                    TOEFL
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>
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
        <Card className="mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Info label="Name" value={profile.name} />
            <Info label="Citizenship" value={profile.citizenship} />
            <Info label="Residence" value={profile.residence} />
            <Info label="Education Country" value={profile.educationCountry} />
            <Info label="Qualification" value={profile.qualification} />
            <Info label="Percentage" value={profile.percentage} />
            <Info label="Intended major" value={profile.intendedMajor} />
            <Info label="Budget" value={profile.budget ? `${profile.budgetCurrency} ${Number(profile.budget).toLocaleString()}` : ''} />
            <Info label="Preferred destinations" value={profile.preferredDestinations} />
            <Info label="SAT" value={profile.sat ? 'Taken / Planned' : 'No'} />
            <Info label="IELTS" value={profile.ielts ? 'Taken / Planned' : 'No'} />
            <Info label="TOEFL" value={profile.toefl ? 'Taken / Planned' : 'No'} />
          </div>
        </Card>
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
