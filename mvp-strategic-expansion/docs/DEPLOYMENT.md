# 🚀 Flimmer Mobile - Deployment & Demo Guide

## 📱 Quick Demo Setup

### For Presentations (iOS & Android)

#### Option 1: Expo Go (Fastest)
```bash
# Start the development server
npm start

# Scan QR code with:
# - iOS: Camera app or Expo Go
# - Android: Expo Go app
```

#### Option 2: Development Builds (Recommended for demos)
```bash
# Build demo versions for both platforms
npm run fastlane:demo

# This creates:
# - iOS: builds/ios/dev/FlimmerMobile-dev.ipa
# - Android: builds/android/demo/FlimmerMobile-Demo.apk
```

#### Option 3: EAS Build (Production-like)
```bash
# Build with EAS for more realistic demo
npx eas build --profile demo --platform all
```

---

## 🛠 Development Setup

### Prerequisites
- Node.js 18+
- Expo CLI
- Xcode (for iOS)
- Android Studio (for Android)
- Ruby & Bundler (for Fastlane)

### Initial Setup
```bash
# Install dependencies
npm install

# Install Expo CLI globally
npm install -g @expo/cli

# Install iOS dependencies (macOS only)
cd ios && bundle install

# Install Fastlane
gem install fastlane

# Setup git hooks
npm run prepare
```

### Environment Variables
Create `.env` file:
```bash
# Apple Developer
APPLE_TEAM_ID=YOUR_TEAM_ID
MATCH_PASSWORD=your_match_password
FASTLANE_PASSWORD=your_apple_password

# Android
ANDROID_KEYSTORE_PATH=./android/app/release.keystore
ANDROID_KEY_ALIAS=release
ANDROID_KEYSTORE_PASSWORD=your_keystore_password
ANDROID_KEY_PASSWORD=your_key_password

# EAS
EXPO_TOKEN=your_expo_token
```

---

## 📱 Platform-Specific Setup

### iOS Setup

#### 1. Apple Developer Account
- Enroll in Apple Developer Program ($99/year)
- Create App ID: `com.flimmer.app`
- Setup certificates and provisioning profiles

#### 2. Fastlane Match Setup
```bash
# Initialize match (first time only)
fastlane match init

# Generate certificates
fastlane match development
fastlane match appstore
```

#### 3. Xcode Configuration
```bash
# Generate iOS project
npx expo prebuild --platform ios

# Open in Xcode
open ios/FlimmerMobile.xcworkspace
```

### Android Setup

#### 1. Google Play Console
- Create developer account ($25 one-time fee)
- Create new app: "Flimmer"
- Setup app signing

#### 2. Generate Keystore
```bash
# Generate release keystore
keytool -genkey -v -keystore android/app/release.keystore \
  -alias release -keyalg RSA -keysize 2048 -validity 10000
```

#### 3. Android Studio Configuration
```bash
# Generate Android project
npx expo prebuild --platform android

# Open in Android Studio
open android/
```

---

## 🚀 Deployment Workflows

### Development Builds
```bash
# iOS Development
npm run fastlane:ios:dev

# Android Development
npm run fastlane:android:dev

# Both platforms
npm run fastlane:demo
```

### Staging Deployment
```bash
# Deploy to TestFlight (iOS) and Play Console Internal (Android)
npm run fastlane:ios:staging
npm run fastlane:android:staging
```

### Production Deployment
```bash
# Deploy to App Store and Play Store
npm run fastlane:ios:production
npm run fastlane:android:production
```

---

## 🎯 Demo Instructions

### For Investors/Stakeholders

#### Pre-Demo Checklist
- [ ] Both devices charged and connected to WiFi
- [ ] Latest demo builds installed
- [ ] Demo data populated
- [ ] Backup devices ready

#### Demo Script

**1. Introduction (30 seconds)**
- "This is Flimmer, the first AI-powered family safety platform"
- Show both parent and child interfaces side by side

**2. Parent Experience (2 minutes)**
- Open parent app, show dashboard
- Demonstrate real-time activity monitoring
- Show safety alerts and AI insights
- Use emergency pause feature
- Navigate through safety intelligence

**3. Child Experience (1 minute)**
- Open child app, show age-appropriate interface
- Demonstrate video upload with approval flow
- Show safety reminders and education

**4. Real-time Connection (1 minute)**
- Show live activity updates between devices
- Demonstrate intervention capabilities
- Show notification system

**5. Key Differentiators (30 seconds)**
- Proactive vs reactive safety
- AI-powered insights
- Real-time family connection
- GDPR-compliant design

#### Demo Accounts
```typescript
// Parent Account
Username: Sarah Johnson
Role: Parent
Features: Full dashboard, live monitoring, AI insights

// Child Account  
Username: Emma Johnson
Role: Child
Features: Safe interface, content creation, approval flow
```

### Installation on Demo Devices

#### iOS Installation
```bash
# Method 1: Xcode (Development)
1. Connect iPhone via USB
2. Open Xcode
3. Window > Devices and Simulators
4. Drag IPA file to device

# Method 2: TestFlight (Staging)
1. Install TestFlight from App Store
2. Use invitation link from Fastlane
3. Install beta version

# Method 3: Diawi (Quick sharing)
1. Upload IPA to diawi.com
2. Share link with demo team
3. Install via Safari
```

#### Android Installation
```bash
# Method 1: ADB (Development)
adb install builds/android/demo/FlimmerMobile-Demo.apk

# Method 2: Direct APK (Easiest)
1. Enable "Install from Unknown Sources"
2. Download APK to device
3. Tap to install

# Method 3: Google Play Console (Staging)
1. Add testers to internal track
2. Install via Play Store
```

---

## 🧪 Testing Strategy

### Unit Tests
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### E2E Tests
```bash
# iOS E2E tests
npm run e2e:build
npm run e2e:test

# Android E2E tests
npm run e2e:test:android
```

### Manual Testing Checklist

#### Authentication Flow
- [ ] Parent role selection works
- [ ] Child role selection works
- [ ] Quick demo buttons work
- [ ] Form validation works
- [ ] Login persistence works

#### Parent Dashboard
- [ ] Real-time activity updates
- [ ] Safety alerts display
- [ ] Emergency pause works
- [ ] Settings configuration
- [ ] Logout functionality

#### Child Interface
- [ ] Age-appropriate design
- [ ] Video upload flow
- [ ] Content approval status
- [ ] Safety reminders visible
- [ ] Navigation works

#### Cross-Platform
- [ ] Consistent UI/UX
- [ ] Performance comparable
- [ ] Feature parity maintained
- [ ] Platform-specific optimizations

---

## 📊 CI/CD Pipeline

### GitHub Actions Workflows

#### On Pull Request
- Code linting and formatting
- Unit test execution
- Type checking
- Security audit

#### On Develop Branch
- All PR checks
- Development builds (iOS & Android)
- E2E test execution
- Artifact upload

#### On Main Branch
- All previous checks
- Staging deployment
- TestFlight upload
- Play Console internal track

#### On Release
- Production builds
- App Store submission
- Play Store production track
- Release notes generation

### Manual Triggers

#### Demo Builds
```bash
# Trigger via commit message
git commit -m "Update demo features [demo]"
git push

# Or manually trigger workflow
gh workflow run "CI/CD Pipeline" --ref main
```

#### Emergency Deployment
```bash
# Hotfix deployment
npm run fastlane:ios:production
npm run fastlane:android:production
```

---

## 🔧 Troubleshooting

### Common Issues

#### iOS Build Failures
```bash
# Clean Xcode cache
npm run clean:ios

# Reset certificates
fastlane match nuke development
fastlane match development

# Regenerate project
npm run prebuild:clean
```

#### Android Build Failures
```bash
# Clean Gradle cache
npm run clean:android

# Reset Android project
cd android && ./gradlew clean
npm run prebuild:clean
```

#### Expo Issues
```bash
# Clear Expo cache
expo r -c

# Reset everything
npm run dev:reset
```

### Performance Optimization

#### Bundle Size
```bash
# Analyze bundle
npx expo export --dump-assetmap

# Check for large dependencies
npm run analyze-bundle
```

#### Build Times
```bash
# Use EAS Build for faster builds
npx eas build --profile preview

# Enable caching
npx eas build --clear-cache=false
```

---

## 📈 Monitoring & Analytics

### Crash Reporting
- **iOS**: Crashlytics via Firebase
- **Android**: Crashlytics via Firebase
- **Real-time**: Sentry integration

### Performance Monitoring
- App startup time
- Screen load times
- Memory usage
- Battery impact

### User Analytics
- Feature usage
- User flows
- Retention rates
- Safety metrics

---

## 🔒 Security Considerations

### Code Signing
- iOS: Apple Developer certificates
- Android: Release keystore
- Automated via Fastlane

### API Security
- HTTPS only
- Certificate pinning
- API key rotation
- Rate limiting

### Data Protection
- Local encryption
- Secure storage
- GDPR compliance
- Child data protection

---

## 📞 Support & Maintenance

### Release Schedule
- **Patch releases**: Weekly (bug fixes)
- **Minor releases**: Bi-weekly (features)
- **Major releases**: Monthly (major features)

### Hotfix Process
1. Create hotfix branch
2. Apply minimal fix
3. Emergency CI/CD pipeline
4. Fast-track app store review

### Monitoring Alerts
- Build failures
- Deployment issues
- Crash rate spikes
- Performance degradation

---

Run `npm run fastlane:demo`

# Flimmer Mobile Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Flimmer mobile application across different environments using Expo Application Services (EAS), Fastlane automation, and CI/CD pipelines.

**Deployment Targets**:
- **Development**: Internal testing and demo builds
- **Staging**: Pre-production testing environment
- **Production**: App Store and Google Play Store releases

**Key Technologies**:
- **Expo Application Services (EAS)**: Cloud build and deployment
- **Fastlane**: Automated iOS and Android deployment
- **GitHub Actions**: CI/CD pipeline automation
- **TestFlight**: iOS beta distribution
- **Google Play Console**: Android app distribution

---

## Prerequisites

### Development Environment Setup

**Required Tools**:
```bash
# Install Expo CLI
npm install -g @expo/cli

# Install EAS CLI
npm install -g eas-cli

# Install Fastlane
sudo gem install fastlane

# Verify installations
expo --version
eas --version
fastlane --version
```

**Account Setup**:
- **Expo Account**: Required for EAS builds
- **Apple Developer Account**: iOS app distribution
- **Google Play Console**: Android app distribution
- **GitHub Account**: CI/CD pipeline access

### Project Configuration

**EAS Project Setup**:
```bash
# Login to Expo
eas login

# Initialize EAS project
eas init

# Configure project
eas build:configure
```

**Environment Variables**:
```bash
# Required for deployment
export EXPO_TOKEN=your-expo-token
export APPLE_ID=your-apple-id
export GOOGLE_PLAY_JSON_KEY_PATH=path/to/service-account.json
export MATCH_PASSWORD=your-match-password
```

---

## Build Configuration

### EAS Build Configuration

**eas.json**:
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      }
    },
    "staging": {
      "distribution": "internal",
      "channel": "staging",
      "ios": {
        "resourceClass": "m1-medium",
        "bundleIdentifier": "com.flimmer.staging"
      },
      "android": {
        "buildType": "apk",
        "applicationId": "com.flimmer.staging"
      }
    },
    "production": {
      "distribution": "store",
      "channel": "production",
      "ios": {
        "resourceClass": "m1-medium",
        "bundleIdentifier": "com.flimmer.app"
      },
      "android": {
        "buildType": "aab",
        "applicationId": "com.flimmer.app"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id",
        "ascAppId": "your-app-store-connect-id",
        "appleTeamId": "your-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "production"
      }
    }
  }
}
```

### App Configuration

**app.json**:
```json
{
  "expo": {
    "name": "Flimmer",
    "slug": "flimmer",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.flimmer.app",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses camera for safe content creation",
        "NSLocationWhenInUseUsageDescription": "This app uses location for family safety features"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.flimmer.app",
      "versionCode": 1,
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-camera",
      "expo-location",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

---

## Development Deployment

### Local Development

**Start Development Server**:
```bash
# Start Expo development server
npm start

# Start with specific platform
npm run ios
npm run android
npm run web
```

**Development Build**:
```bash
# Build development client
eas build --profile development --platform all

# Install on device
eas build --profile development --platform ios --local
eas build --profile development --platform android --local
```

### Internal Testing

**Create Development Build**:
```bash
# Build for internal distribution
eas build --profile development

# Share build with team
eas build:list --limit 10
```

**TestFlight Distribution (iOS)**:
```bash
# Build and submit to TestFlight
eas build --profile development --platform ios
eas submit --profile development --platform ios
```

**Internal App Sharing (Android)**:
```bash
# Build APK for internal sharing
eas build --profile development --platform android
```

---

## Staging Deployment

### Staging Environment Setup

**Environment Configuration**:
```bash
# Set staging environment
export EXPO_PUBLIC_ENV=staging
export API_BASE_URL=https://staging-api.flimmer.com
```

**Staging Build**:
```bash
# Build staging version
eas build --profile staging --platform all

# Submit to staging tracks
eas submit --profile staging --platform ios
eas submit --profile staging --platform android
```

### Staging Testing

**Automated Testing**:
```bash
# Run E2E tests on staging build
detox test --configuration ios.sim.staging
detox test --configuration android.emu.staging
```

**Manual Testing Checklist**:
- **Authentication Flow**: Login/logout functionality
- **Core Features**: Parent dashboard, child interface
- **Cross-Platform Sync**: Real-time updates
- **Privacy Controls**: GDPR compliance features
- **Performance**: App responsiveness and stability

---

## Production Deployment

### Pre-Production Checklist

**Code Quality**:
```bash
# Run comprehensive tests
npm run test
npm run test:e2e
npm run lint
npm run type-check

# Security audit
npm audit
```

**Build Verification**:
```bash
# Test production build locally
eas build --profile production --local --platform all
```

**App Store Requirements**:
- **App Store Connect**: Complete app information
- **Privacy Policy**: Updated privacy documentation
- **App Review**: Compliance with store guidelines
- **Screenshots**: Current app screenshots
- **Metadata**: App description and keywords

### Production Build Process

**Version Management**:
```bash
# Update version numbers
npm version patch  # or minor/major

# Update build numbers
# iOS: increment buildNumber in app.json
# Android: increment versionCode in app.json
```

**Production Build**:
```bash
# Build production version
eas build --profile production --platform all

# Verify build success
eas build:list --status finished --limit 5
```

**App Store Submission**:
```bash
# Submit to App Store
eas submit --profile production --platform ios

# Submit to Google Play
eas submit --profile production --platform android
```

---

## Fastlane Automation

### Fastlane Configuration

**Fastfile**:
```ruby
default_platform(:ios)

platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    # Build with EAS
    sh("eas build --profile staging --platform ios --non-interactive")
    
    # Get latest build
    build_url = sh("eas build:list --platform ios --status finished --limit 1 --json | jq -r '.[0].artifacts.buildUrl'")
    
    # Download and upload to TestFlight
    download_url(url: build_url)
    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      skip_submission: true
    )
  end

  desc "Deploy to App Store"
  lane :release do
    # Build production version
    sh("eas build --profile production --platform ios --non-interactive")
    
    # Submit to App Store
    sh("eas submit --profile production --platform ios --non-interactive")
  end
end

platform :android do
  desc "Build and upload to Play Console"
  lane :beta do
    # Build with EAS
    sh("eas build --profile staging --platform android --non-interactive")
    
    # Submit to internal testing
    sh("eas submit --profile staging --platform android --non-interactive")
  end

  desc "Deploy to Google Play"
  lane :release do
    # Build production version
    sh("eas build --profile production --platform android --non-interactive")
    
    # Submit to Google Play
    sh("eas submit --profile production --platform android --non-interactive")
  end
end
```

### Fastlane Execution

**iOS Deployment**:
```bash
# Deploy to TestFlight
fastlane ios beta

# Deploy to App Store
fastlane ios release
```

**Android Deployment**:
```bash
# Deploy to Play Console
fastlane android beta

# Deploy to Google Play
fastlane android release
```

---

## CI/CD Pipeline

### GitHub Actions Configuration

**.github/workflows/deploy.yml**:
```yaml
name: Deploy Mobile App

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: |
          npm run test
          npm run lint
          npm run type-check
      
      - name: Security audit
        run: npm audit --audit-level moderate

  build-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build staging app
        run: eas build --profile staging --platform all --non-interactive
      
      - name: Submit to staging
        run: eas submit --profile staging --platform all --non-interactive

  build-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build production app
        run: eas build --profile production --platform all --non-interactive
      
      - name: Submit to stores
        run: eas submit --profile production --platform all --non-interactive
      
      - name: Create GitHub release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          body: |
            Automated production release
            - iOS: Submitted to App Store
            - Android: Submitted to Google Play
          draft: false
          prerelease: false
```

### Required Secrets

**GitHub Secrets Configuration**:
```bash
# Expo
EXPO_TOKEN=your-expo-token

# iOS
APPLE_ID=your-apple-id
APPLE_APP_SPECIFIC_PASSWORD=your-app-password
MATCH_PASSWORD=your-match-password

# Android
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON=service-account-json-content

# General
SLACK_WEBHOOK_URL=your-slack-webhook (optional)
```

---

## Environment Management

### Environment Variables

**Development Environment**:
```bash
# .env.development
EXPO_PUBLIC_ENV=development
API_BASE_URL=http://localhost:3000
DEBUG_MODE=true
LOG_LEVEL=debug
```

**Staging Environment**:
```bash
# .env.staging
EXPO_PUBLIC_ENV=staging
API_BASE_URL=https://staging-api.flimmer.com
DEBUG_MODE=false
LOG_LEVEL=info
ANALYTICS_ENABLED=true
```

**Production Environment**:
```bash
# .env.production
EXPO_PUBLIC_ENV=production
API_BASE_URL=https://api.flimmer.com
DEBUG_MODE=false
LOG_LEVEL=error
ANALYTICS_ENABLED=true
CRASH_REPORTING_ENABLED=true
```

### Configuration Management

**Environment-Specific Configuration**:
```typescript
// config/environment.ts
interface Config {
  apiBaseUrl: string;
  debugMode: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
}

const developmentConfig: Config = {
  apiBaseUrl: 'http://localhost:3000',
  debugMode: true,
  logLevel: 'debug',
  analyticsEnabled: false,
  crashReportingEnabled: false,
};

const stagingConfig: Config = {
  apiBaseUrl: 'https://staging-api.flimmer.com',
  debugMode: false,
  logLevel: 'info',
  analyticsEnabled: true,
  crashReportingEnabled: true,
};

const productionConfig: Config = {
  apiBaseUrl: 'https://api.flimmer.com',
  debugMode: false,
  logLevel: 'error',
  analyticsEnabled: true,
  crashReportingEnabled: true,
};

const getConfig = (): Config => {
  const env = process.env.EXPO_PUBLIC_ENV || 'development';
  
  switch (env) {
    case 'staging':
      return stagingConfig;
    case 'production':
      return productionConfig;
    default:
      return developmentConfig;
  }
};

export default getConfig();
```

---

## Monitoring and Analytics

### Crash Reporting

**Sentry Integration**:
```typescript
// app/App.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: process.env.EXPO_PUBLIC_ENV,
  enableAutoSessionTracking: true,
  debug: process.env.EXPO_PUBLIC_ENV === 'development',
});

export default Sentry.wrap(App);
```

### Performance Monitoring

**Analytics Setup**:
```typescript
// services/analytics.ts
import { Analytics } from '@segment/analytics-react-native';

const analytics = new Analytics({
  writeKey: 'your-segment-write-key',
  trackAppLifecycleEvents: true,
  trackDeepLinks: true,
});

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (config.analyticsEnabled) {
    analytics.track(event, properties);
  }
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (config.analyticsEnabled) {
    analytics.identify(userId, traits);
  }
};
```

---

## Troubleshooting

### Common Deployment Issues

**Build Failures**:
```bash
# Clear EAS cache
eas build:cancel --all
eas build --clear-cache

# Check build logs
eas build:list --status errored --limit 5
eas build:view [build-id]
```

**Submission Issues**:
```bash
# Check submission status
eas submit:list --limit 10

# Retry failed submission
eas submit --profile production --platform ios --latest
```

**Certificate Issues**:
```bash
# Reset iOS certificates
eas credentials --platform ios --clear-all

# Regenerate certificates
eas credentials --platform ios
```

### Debug Information

**Build Diagnostics**:
```bash
# Check project configuration
eas config

# Validate project setup
eas doctor

# Check build queue
eas build:list --status in-queue
```

**Environment Debugging**:
```bash
# Check environment variables
printenv | grep EXPO

# Validate configuration
expo config --type public
```

---

## Security Considerations

### Code Signing

**iOS Code Signing**:
- **Development**: Automatic provisioning for development
- **Distribution**: App Store distribution certificates
- **Enterprise**: Enterprise distribution (if applicable)

**Android Code Signing**:
- **Debug**: Automatic debug keystore
- **Release**: Production keystore management
- **Play App Signing**: Google Play App Signing enabled

### Secret Management

**Sensitive Data Protection**:
- **API Keys**: Use environment variables
- **Certificates**: Secure storage in CI/CD
- **Passwords**: Encrypted secret management
- **Tokens**: Rotation and expiration policies

### App Security

**Runtime Protection**:
- **Code Obfuscation**: Enabled for production builds
- **Certificate Pinning**: API security
- **Root/Jailbreak Detection**: Security monitoring
- **Debugging Prevention**: Production hardening

---

## Best Practices

### Deployment Workflow

**Development Process**:
1. **Feature Development**: Local development and testing
2. **Pull Request**: Code review and automated testing
3. **Staging Deployment**: Internal testing and validation
4. **Production Deployment**: App store submission
5. **Monitoring**: Performance and error tracking

### Version Management

**Semantic Versioning**:
- **Major**: Breaking changes or major features
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes and minor improvements

**Build Numbers**:
- **iOS**: Increment build number for each submission
- **Android**: Increment version code for each release

### Release Strategy

**Phased Rollout**:
1. **Internal Testing**: Team and stakeholder validation
2. **Beta Release**: Limited user testing
3. **Staged Rollout**: Gradual production release
4. **Full Release**: Complete user base deployment

---

## Conclusion

This deployment guide provides comprehensive coverage of the Flimmer mobile app deployment process across all environments. The combination of EAS builds, Fastlane automation, and CI/CD pipelines ensures reliable, consistent deployments while maintaining security and quality standards.

**Key Success Factors**:
1. **Automated Testing**: Comprehensive test coverage before deployment
2. **Environment Consistency**: Standardized configurations across environments
3. **Security**: Proper secret management and code signing
4. **Monitoring**: Real-time performance and error tracking
5. **Documentation**: Clear processes and troubleshooting guides

**Next Steps**:
1. **Setup**: Configure EAS project and credentials
2. **Testing**: Validate deployment process in staging
3. **Automation**: Implement CI/CD pipeline
4. **Monitoring**: Setup analytics and crash reporting
5. **Optimization**: Monitor and improve deployment performance