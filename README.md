# CU Blood API Documentation

## Prefix

```
/v0
```

## Example
```
https://domain.tld/v0/commons
```

## Table of Contents

- [Commons](#commons)
- [Announcements](#announcements)
- [Events](#events)
- [Registration](#registration)
- [Authentication & User Profile](#authentication--user-profile)
- [Enrollment](#enrollment)
- [Insights](#insights)
- [Phase 2](#phase-2)
- [References](#references)

## Commons

### Get latest project information

**URL**
```
GET /commons
```

### Get Facebook posts

**URL**
```
GET /commons/facebook/posts
```

### Get Facebook albums

**URL**
```
GET /commons/facebook/albums
```

### Get Facebook photos

**URL**
```
GET /commons/facebook/albums/:albumId/photos
```

**Parameters**

Parameter | Value Type | Description
--- | --- | ---
`:albumId` | Number | Facebook's Album ID

## Announcements

### Get all announcements

**URL**
```
GET /announcements/all/:pageIndex
```

**Parameters**

Parameter | Value Type | Description
--- | --- | ---
`:pageIndex` | Number | Page Index

### Get specific announcement

**URL**
```
GET /announcements/:announcementId
```

**Parameters**

Parameter | Value Type | Description
--- | --- | ---
`:announcementId` | Number | Announcement ID

## Events

### Get all events

**URL**
```
GET /events/all/:pageIndex
```

**Parameters**

Parameter | Value Type | Description
--- | --- | ---
`:pageIndex` | Number | Page Index

### Get specific event

**URL**
```
GET /events/:eventId
```

**Parameters**

Parameter | Value Type | Description
--- | --- | ---
`:eventId` | Number | Event ID

## Registration

### Registration

**URL**
```
POST /profile/login
```

**Request Body**

Key | Value Type | Description
--- | --- | ---
`firstName` | String | First Name
`lastName` | String | Last Name
`nickname` | String | Nickname
`gender` | Number | Gender (0, 1)
`bloodType` | Number | Blood Type
`birthday` | String | Birthday (eg. '1999-12-31')
`username` | String | Email Address
`password` | String | Password
`citizenId` | String | Citizen Identification Number
`phoneNumber` | String | Phone Number
`weight` | Number | Weight
`medicalCondition` | String | Medical Condition
`shirtSize` | Number | Shirt Size

## Authentication & User Profile

### Login

**URL**
```
POST /profile/login
```

**Request Body**

Key | Value Type | Description
--- | --- | ---
`username` | String | Email Address
`password` | String | Password

### Logout

**URL**
```
POST /profile/logout
```

### User Profile

**URL**
```
GET /profile/me
```

### Update Profile

**URL**
```
PUT /profile/update
```

**Request Body**

Key | Value Type | Description
--- | --- | ---
`firstName` | String | First Name
`lastName` | String | Last Name
`nickname` | String | Nickname
`gender` | Number | Gender (0, 1)
`bloodType` | Number | Blood Type
`birthday` | String | Birthday (eg. '1999-12-31')
`username` | String | Email Address
`password` | String | Password
`citizenId` | String | Citizen Identification Number
`phoneNumber` | String | Phone Number
`weight` | Number | Weight
`medicalCondition` | String | Medical Condition
`shirtSize` | Number | Shirt Size

## Enrollment

### Enroll

**URL**
```
POST /profile/me/enroll
```

**Request Body**

Key | Value Type | Description
--- | --- | ---
`projectId` | Number | Project ID
`locationId` | Number | Registration Point
`timeSlot` | String | Date (eg. '2019-12-31')

### Change Registration Point

**URL**
```
PUT /profile/me/enroll
```

**Request Body**

Key | Value Type | Description
--- | --- | ---
`sessionId` | String | Session ID
`locationId` | Number | (Optional) Registration Point
`timeSlot` | String | (Optional) Date (eg. '2019-12-31')

### Enrollment History

**URL**
```
GET /profile/me/sessions
```

## Insights

### Number of Donors

**URL**
```
GET /commons/insights/sessions/:startDate/:endDate/:status
```

**Parameters**

Parameter | Value Type | Description
--- | --- | ---
`:startDate` | String | Start Date (eg. '2019-12-31')
`:endDate` | String | End Date (eg. '2019-12-31')
`:status` | String | Check-Out Status ('all', 0, 1, 2, 3)

**URL**
```
GET /commons/insights/sessions/:startDate/:unitOfMeasurement/:duration/:status
```

**Parameters**

Parameter | Value Type | Description
--- | --- | ---
`:startDate` | String | Start Date (eg. '2019-12-31')
`:unitOfMeasurement` | String | Unit of Measurement ('years', 'months', 'weeks', 'days')
`:duration` | Number | Duration
`:status` | String | Check-Out Status ('all', 0, 1, 2, 3)

### Blood Types
```
GET /commons/insights/blood-types
```

## Phase 2


### Verification

**URL**
```
POST /users/verify
```

**Request Header**

Key | Value Type | Description
--- | --- | ---
`Authorization` | String | API Key

**Request Body**

Key | Value Type | Description
--- | --- | ---
`code` | String | QR Code Payload

**Sample Response (Success)**
```json
{
    "status": 200,
    "message": "Endpoint reached",
    "success": true,
    "cache": false,
    "result": {
        "id": "970f3077-5f11-4a3c-94f6-2eb77edf278a",
        "timeSlot": "2019-02-09",
        "checkIn": null,
        "checkOut": null,
        "status": null,
        "createdAt": "2019-02-02T02:17:59.430Z",
        "project": {
            "name": "CU Blood Season 6",
            "startDate": "2019-02-08T05:00:00.000Z",
            "endDate": "2019-02-14T05:00:00.000Z"
        },
        "user": {
            "firstName": "Alvah",
            "lastName": "Quigley",
            "gender": 1,
            "username": "juana.weimann33"
        },
        "location": {
            "name": "อาคารมหิตลาธิเบศร จุฬาลงกรณ์มหาวิทยาลัย"
        }
    }
}
```

**Sample Response (Failed)**
```json
{
    "status": 404,
    "message": "Not found",
    "success": false,
    "cache": false,
    "result": {}
}
```

### Check-In

**URL**
```
PUT /users/check-in
```

**Request Header**

Key | Value Type | Description
--- | --- | ---
`Authorization` | String | API Key

**Request Body**

Key | Value Type | Description
--- | --- | ---
`code` | String | QR Code Payload

**Sample Response (Success)**
```json
{
    "status": 200,
    "message": "Endpoint reached",
    "success": true,
    "cache": false,
    "result": {}
}
```

**Sample Response (Failed)**
```json
{
    "status": 400,
    "message": "Bad request",
    "success": false,
    "cache": false,
    "result": {}
}
```

### Check-Out

**URL**
```
PUT /users/check-out
```

**Request Header**

Key | Value Type | Description
--- | --- | ---
`Authorization` | String | API Key

**Request Body**

Key | Value Type | Description
--- | --- | ---
`code` | String | QR Code Payload
`status` | Number | Check-Out Status Code

**Sample Response (Success)**
```json
{
    "status": 200,
    "message": "Endpoint reached",
    "success": true,
    "cache": false,
    "result": {}
}
```

**Sample Response (Failed)**
```json
{
    "status": 400,
    "message": "Bad request",
    "success": false,
    "cache": false,
    "result": {}
}
```

## References

### Blood Type

Blood Type | Rh | Value
--- | --- | ---
A | - | 0
A | + | 1
B | - | 2
B | + | 3
O | - | 4
O | + | 5
AB | - | 6
AB | + | 7

### Gender

Gender | Value
--- | ---
Male | 0
Female | 1

### Shirt Size

Size | Value
--- | ---
XS | 0
S | 1
M | 2
L | 3
XL | 4
XXL | 5
XXXL | 6

### Onboarding

Status | Value | Description
--- | --- | ---
Onboarding | 0 | Account is linked with LDAP and some additional details are not filled.
Onboarded | 1 | Account is linked with LDAP with additional details filled.

### HTTP Status Code

Code | Message
--- | ---
200 | Success / Endpoint reached
205 | Reset content
400 | Bad request
401 | Not authenticated
403 | Forbidden
404 | Not found
422 | Unprocessable entity
429 | Too many requests
500 | Server error
501 | Not implemented