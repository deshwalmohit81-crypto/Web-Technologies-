# Firebase Security Rules Specification

This document details the security specification, data invariants, and edge-case payloads to be rejected by the Cloud Firestore security rules.

## 1. Data Invariants
- **Unverified Block**: Users must have `email_verified == true` to write to collections like `leads`, `client_projects`, `client_tickets` (unless the app allows anonymous or standard signup, but we default to verified).
- **Users Immutable**: Users can only modify their own user document, but CANNOT change their `role` (to prevent privilege escalation).
- **Relational Integrity**: Client projects must belong to the active authenticated client.
- **Support Tickets**: Support ticket replies must identify the correct sender role ('client' or 'support') based on their UID or admin role.
- **Admin Lockdown**: Collections like `blogs`, `portfolios`, `careers` can only be written by authenticated Admins.

## 2. The "Dirty Dozen" Malicious Payloads

The following payloads attempt to bypass identity, integrity, or state checks and must be rejected:

### Payload 1: Admin Role Hijacking (Privilege Escalation)
A client attempts to set their own role to 'admin'.
```json
{
  "uid": "user_123",
  "email": "client@example.com",
  "name": "Malicious Client",
  "role": "admin"
}
```

### Payload 2: Spoofed Author in Blog Creation
A non-admin attempts to create a blog post.
```json
{
  "title": "Hacked Post",
  "slug": "hacked-post",
  "content": "Malicious content",
  "category": "Tech",
  "author": "Attacker"
}
```

### Payload 3: Spoofed Client ID in Project Creation
A user attempts to submit a client project on behalf of another user's UID.
```json
{
  "clientId": "other_victim_uid",
  "title": "Phished Project",
  "service": "Design",
  "description": "Stealing data"
}
```

### Payload 4: Invalid Project Budget String Injection
An attacker attempts a Denial of Wallet or resource exhaustion by submitting a 1MB budget description.
```json
{
  "clientId": "user_123",
  "title": "Heavy Budget",
  "service": "Dev",
  "budget": "..." 
}
```

### Payload 5: Unverified User Contact Lead Submission
A user whose email is not verified attempts to submit a lead (or spoof a verified flag).
```json
{
  "name": "Fake User",
  "email": "fake@unverified.com",
  "phone": "00000",
  "service": "SEO"
}
```

### Payload 6: Modifying Immortal Creation Timestamp
An attacker attempts to alter the `createdAt` value during an update.
```json
{
  "title": "Altered Project",
  "createdAt": "2020-01-01T00:00:00Z"
}
```

### Payload 7: Shortcut Ticket Status Change
A client attempts to mark a support ticket as resolved without proper permissions or steps.
```json
{
  "status": "resolved"
}
```

### Payload 8: Injection of Non-string Array Elements in Portfolios
An attacker attempts to inject a nested object into a portfolio tag list.
```json
{
  "tags": [ { "malicious": true } ]
}
```

### Payload 9: Long String ID Injection (ID Poisoning)
Document creation with an ID larger than 128 characters or containing invalid characters.

### Payload 10: Anonymous Application Submission
Submitting a job application with empty contact emails or invalid job reference.

### Payload 11: System-Only Fields Overwrite
An attacker attempts to rewrite system-generated notes or fields on their project document.

### Payload 12: Email Spoofing with unverified email
Signing in with an unverified email claiming to be the admin `deshwal.mohit81@gmail.com`.

---

## 3. Test Cases Verification (firestore.rules.test.ts)

A test suite will be set up to ensure the above payloads are properly handled and result in `PERMISSION_DENIED` errors.
