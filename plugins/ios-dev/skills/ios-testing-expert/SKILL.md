---
name: iOS Testing Expert
description: iOS testing - XCTest, XCUITest, Quick/Nimble, test patterns for Swift
allowed-tools: Read, Edit, Bash
model: sonnet
---

# iOS Testing Expert

Comprehensive testing patterns for iOS apps.

## Testing Pyramid for iOS

```
     /\        E2E (XCUITest) - 10%
    /  \       UI Tests, full flows
   /----\
  /      \     Integration - 20%
 /        \    ViewModels + Services
/----------\
/            \  Unit - 70%
              \ Models, Utils, Pure Logic
```

## XCTest Basics

### Unit Test
```swift
import XCTest
@testable import App

final class UserTests: XCTestCase {

    func testUserFullName() {
        let user = User(firstName: "John", lastName: "Doe")
        XCTAssertEqual(user.fullName, "John Doe")
    }

    func testUserValidation() throws {
        let user = User(email: "invalid")
        XCTAssertThrowsError(try user.validate())
    }
}
```

### Async Testing
```swift
func testAsyncFetch() async throws {
    let service = UserService()
    let user = try await service.fetch(id: "123")
    XCTAssertEqual(user.id, "123")
}

// Or with expectations
func testAsyncWithExpectation() {
    let expectation = expectation(description: "fetch")

    service.fetch(id: "123") { result in
        XCTAssertNotNil(result)
        expectation.fulfill()
    }

    wait(for: [expectation], timeout: 5)
}
```

## XCUITest (UI Tests)

### Basic UI Test
```swift
import XCUITest

final class LoginUITests: XCTestCase {
    let app = XCUIApplication()

    override func setUpWithError() throws {
        continueAfterFailure = false
        app.launch()
    }

    func testLogin() throws {
        app.textFields["email"].tap()
        app.textFields["email"].typeText("test@example.com")

        app.secureTextFields["password"].tap()
        app.secureTextFields["password"].typeText("password123")

        app.buttons["Login"].tap()

        XCTAssertTrue(app.staticTexts["Welcome"].waitForExistence(timeout: 5))
    }
}
```

### Accessibility Identifiers
```swift
// In your SwiftUI View
TextField("Email", text: $email)
    .accessibilityIdentifier("email")

// In UI Test
app.textFields["email"].tap()
```

## Quick/Nimble (BDD Style)

### Setup
```swift
// Package.swift
.package(url: "https://github.com/Quick/Quick.git", from: "7.0.0"),
.package(url: "https://github.com/Quick/Nimble.git", from: "13.0.0"),
```

### BDD Test
```swift
import Quick
import Nimble
@testable import App

final class UserSpec: QuickSpec {
    override class func spec() {
        describe("User") {
            var user: User!

            beforeEach {
                user = User(firstName: "John", lastName: "Doe")
            }

            context("when valid") {
                it("has a full name") {
                    expect(user.fullName).to(equal("John Doe"))
                }

                it("can be validated") {
                    expect { try user.validate() }.toNot(throwError())
                }
            }

            context("when email is invalid") {
                beforeEach {
                    user.email = "invalid"
                }

                it("throws validation error") {
                    expect { try user.validate() }.to(throwError())
                }
            }
        }
    }
}
```

## Mocking with Protocols

### Protocol-Based DI
```swift
protocol UserServiceProtocol {
    func fetch(id: String) async throws -> User
}

// Real implementation
class UserService: UserServiceProtocol {
    func fetch(id: String) async throws -> User {
        // Network call
    }
}

// Mock for testing
class MockUserService: UserServiceProtocol {
    var mockUser: User?
    var shouldFail = false

    func fetch(id: String) async throws -> User {
        if shouldFail { throw APIError.failed }
        return mockUser ?? User(id: id)
    }
}
```

### Testing with Mock
```swift
func testViewModelLoadsUser() async {
    let mockService = MockUserService()
    mockService.mockUser = User(id: "1", name: "Test")

    let viewModel = UserViewModel(service: mockService)
    await viewModel.load()

    XCTAssertEqual(viewModel.user?.name, "Test")
}
```

## Snapshot Testing

### swift-snapshot-testing
```swift
import SnapshotTesting
import SwiftUI

func testUserProfileView() {
    let view = UserProfileView(user: .mock)

    assertSnapshot(
        of: view,
        as: .image(layout: .device(config: .iPhone13))
    )
}
```

## Test Coverage

### Enable Coverage
```bash
xcodebuild test \
  -scheme App \
  -enableCodeCoverage YES \
  -resultBundlePath TestResults.xcresult
```

### View Report
```bash
xcrun xccov view --report TestResults.xcresult
```

Use when: Writing iOS tests, setting up testing infrastructure, mocking
