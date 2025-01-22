# Dokumentacja projektu SEvents

## Opis projektu
SEvents — to aplikacja internetowa do zarządzania wydarzeniami oraz subskrypcji wydarzeń innych użytkowników. Użytkownicy mogą tworzyć konta, publikować swoje wydarzenia, subskrybować wydarzenia innych użytkowników, a także otrzymywać powiadomienia przed rozpoczeciem i po zakończeniu wydarzeń.

Główne technologie:
- **Node.js**: Platforma serwerowa do obsługi zapytań.
- **Express.js**: Framework do routingu i zarządzania zapytaniami HTTP.
- **EJS**: Silnik szablonów do generowania dynamicznych stron HTML.
- **Axios**: Klient do wykonywania zapytań HTTP.
- **PostgreSQL**: Relacyjna baza danych do przechowywania informacji o użytkownikach, wydarzeniach i subskrypcjach.
- **AWS Lambda**: Obliczenia serverless do obsługi operacji logowania/wylogowania użytkowników i wysyłania powiadomień.
- **AWS SNS**: Usługa powiadomień do dostarczania wiadomości użytkownikom.
- **AWS RDS**: Zarządzana baza danych PostgreSQL.

---

## Architektura

### Główne moduły aplikacji:
1. **Uwierzytelnianie i autoryzacja:**
   - Używana jest AWS Lambda do obsługi rejestracji i logowania do kont. Użytkownicy mogą tworzyć konta i logować się, wysyłając zapytania przez API.
   - AWS Cognito zarządza tokenami i weryfikacją tożsamości użytkowników.

2. **Praca z wydarzeniami:**
   - Użytkownicy mogą tworzyć, edytować i usuwać wydarzenia poprzez interfejs. Te operacje są obsługiwane przez Express.js i zapisywane w bazie danych PostgreSQL.
   - Subskrypcje wydarzeń innych użytkowników są zarządzane poprzez ścieżki API.

3. **Powiadomienia:**
   - AWS Lambda okresowo wywołuje AWS SNS do wysyłania powiadomień do subskrybowanych użytkowników:
     - Dzień przed rozpoczeciem wydarzenia.
     - Natychmiast po rozpoczeciu wydarzenia.

4. **Praca z bazą danych:**
   - PostgreSQL, uruchomiona na AWS RDS, przechowuje dane o użytkownikach, wydarzeniach i subskrypcjach.
   - Baza danych jest zaprojektowana z wykorzystaniem następujących głównych tabel:
     - **users:** informacje o użytkownikach (ID, imię, email, hasło).
     - **events:** dane wydarzeń (ID, tytuł, opis, czas rozpoczecia i zakończenia, autor).
     - **subscriptions:** subskrypcje użytkowników na wydarzenia (ID użytkownika, ID wydarzenia).

---

## Integracje AWS

### AWS Lambda
Używana do wykonywania funkcji serverless:
- **Funkcje rejestracji i logowania:**
  - Przetwarzają zapytania użytkowników przez REST API.
  - Komunikują się z AWS Cognito w celu zarządzania tokenami uwierzytelniającymi.

- **Funkcje powiadomień:**
  - Okresowo wywoływane za pomocą Amazon CloudWatch Events.
  - Sprawdzają bazę danych w poszukiwaniu wydarzeń wymagających powiadomień.
  - Wysyłają powiadomienia za pomocą AWS SNS.

### AWS RDS (PostgreSQL)
- Baza danych uruchomiona na zarządzanej platformie AWS RDS, co upraszcza jej skalowanie, tworzenie kopii zapasowych i monitorowanie.
- Połączenie odbywa się za pomocą biblioteki pg dla Node.js.
- Tabele:
  ```sql
  CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL
  );

  CREATE TABLE events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      author_id INTEGER REFERENCES users(id)
  );

  CREATE TABLE subscriptions (
      user_id INTEGER REFERENCES users(id),
      event_id INTEGER REFERENCES events(id),
      PRIMARY KEY (user_id, event_id)
  );
  ```

### AWS SNS
- Używana do wysyłania powiadomień:
  - E-mail lub SMS powiadomienia dzień przed wydarzeniem.
  - Powiadomienia o rozpoczeciu wydarzenia.
- Konfiguracja subskrypcji i publikacja wiadomości odbywa się przez AWS SDK.

---

## Główne API

### Rejestracja użytkownika
**POST /api/auth/register**
```json
{
  "name": "Imię użytkownika",
  "email": "email@example.com",
  "password": "hasło"
}
```
- Obsługiwane przez AWS Lambda.
- Dodaje użytkownika do bazy danych PostgreSQL.

### Logowanie użytkownika
**POST /api/auth/login**
```json
{
  "email": "email@example.com",
  "password": "hasło"
}
```
- Obsługiwane przez AWS Lambda.
- Zwraca token uwierzytelniający.

### Tworzenie wydarzenia
**POST /api/events**
```json
{
  "title": "Nazwa wydarzenia",
  "description": "Opis wydarzenia",
  "start_time": "2025-01-01T10:00:00Z",
  "end_time": "2025-01-01T12:00:00Z"
}
```
- Obsługiwane przez Express.js.
- Zapisuje dane w tabeli **events**.

### Subskrypcja wydarzenia
**POST /api/events/:id/subscribe**
- Obsługiwane przez Express.js.
- Dodaje rekord do tabeli **subscriptions**.

---

## Wnioski
SEvents zapewnia wygodne zarządzanie wydarzeniami i powiadomieniami, wykorzystując mocne strony AWS. Kluczowe funkcje aplikacji są skalowalne, co pozwala na jej wykorzystanie do pracy z dużą liczbą użytkowników i wydarzeń.

