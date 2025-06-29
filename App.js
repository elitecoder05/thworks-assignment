import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  Button, 
  Alert,
  Platform,
  TouchableOpacity 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Import Notifee with error handling for Expo Go
let notifee = null;
let TriggerType = null;

try {
  const NotifeeModule = require('@notifee/react-native');
  notifee = NotifeeModule.default;
  TriggerType = NotifeeModule.TriggerType;
} catch (error) {
  console.log('Notifee not available in Expo Go. Please use a development build.');
}

export default function App() {
  const [isNotifeeAvailable, setIsNotifeeAvailable] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scheduledTime, setScheduledTime] = useState(new Date(Date.now() + 2 * 60 * 1000)); // Default: 2 minutes from now
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [isPickerReady, setIsPickerReady] = useState(true);

  useEffect(() => {
    //   if Notifee is available and request permissions on load
    if (notifee) {
      setIsNotifeeAvailable(true);
      requestUserPermission();
    } else {
      setIsNotifeeAvailable(false);
    }
  }, []);

  async function requestUserPermission() {
    if (!notifee) return;
    
    try {
      const settings = await notifee.requestPermission();
      
      if (settings.authorizationStatus >= 1) {
        console.log('Permission granted');
        setPermissionGranted(true);
      } else {
        setPermissionGranted(false);
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive notifications.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => notifee.openNotificationSettings() }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      setPermissionGranted(false);
      Alert.alert('Error', 'Failed to request notification permission');
    }
  }

  async function scheduleNotification() {
    if (!notifee || !TriggerType) {
      Alert.alert('Error', 'Notifee is not available. Please use a development build.');
      return;
    }

    if (!permissionGranted) {
      Alert.alert('Permission Required', 'Please grant notification permission first.');
      await requestUserPermission();
      return;
    }

    //   scheduled time
    if (scheduledTime <= new Date()) {
      Alert.alert('Invalid Time', 'Please select a future time for the notification.');
      return;
    }

    try {
       await notifee.cancelAllNotifications();

       const channelId = await notifee.createChannel({
        id: 'scheduled',
        name: 'Scheduled Notifications',
        description: 'Channel for scheduled notifications',
        importance: 4, // High importance
      });

       const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: scheduledTime.getTime(),
      };

      // dummy  notification
      await notifee.createTriggerNotification(
        {
          title: 'HELLO SELVARAJ SIR!!',
          body: `SIDHARTH IS EAGER TO JOIN YOUR DYNAMIC TEAM`,
          android: {
            channelId,
            smallIcon: 'ic_launcher',
            pressAction: {
              id: 'default',
            },
          },
          ios: {
            foregroundPresentationOptions: {
              badge: true,
              sound: true,
              banner: true,
              list: true,
            },
          },
        },
        trigger,
      );

      setIsScheduled(true);
      Alert.alert(
        'Notification Scheduled!', 
        `Your notification has been scheduled for ${scheduledTime.toLocaleString()}`
      );
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to schedule notification');
    }
  }

  function handleTimeChange(event, selectedTime) {
     if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
     if (Platform.OS === 'ios' && event.type === 'dismissed') {
      setShowTimePicker(false);
      return;  
    }
    
     if (selectedTime && event.type !== 'dismissed') {
      setScheduledTime(selectedTime);
       setIsScheduled(false);
    }
  }

  function handleOpenTimePicker() {
    if (!isPickerReady) return;
    
    setIsPickerReady(false);
    setShowTimePicker(true);
    
     setTimeout(() => {
      setIsPickerReady(true);
    }, 500);
  }

  async function cancelScheduledNotifications() {
    if (!notifee) return;
    
    try {
      await notifee.cancelAllNotifications();
      setIsScheduled(false);
      Alert.alert('Cancelled', 'All scheduled notifications have been cancelled!');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
      Alert.alert('Error', 'Failed to cancel notifications');
    }
  }

   if (!isNotifeeAvailable) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️ Notifee Not Available</Text>
          <Text style={styles.errorText}>
            Notifee requires native code and doesn't work in Expo Go. 
            To test notifications, you need to create a development build:
          </Text>
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionStep}>1. Create a development build:</Text>
            <Text style={styles.instructionCode}>npx expo run:ios</Text>
            <Text style={styles.instructionCode}>npx expo run:android</Text>
            <Text style={styles.instructionStep}>2. Or build with EAS:</Text>
            <Text style={styles.instructionCode}>npx eas build --profile development</Text>
          </View>
          <Text style={styles.noteText}>
            The app code is ready and will work once you build it properly!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <Text style={styles.title}>Notification Scheduler</Text>
        <Text style={styles.subtitle}>Schedule local foreground notifications</Text>
        
         <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Permission Status:</Text>
          <Text style={[styles.statusValue, { color: permissionGranted ? '#34C759' : '#FF3B30' }]}>
            {permissionGranted ? '✅ Granted' : '❌ Not Granted'}
          </Text>
        </View>

        {!permissionGranted && (
          <TouchableOpacity style={styles.permissionButton} onPress={requestUserPermission}>
            <Text style={styles.permissionButtonText}>Request Permission</Text>
          </TouchableOpacity>
        )}

         <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>Scheduled Time:</Text>
          <TouchableOpacity 
            style={[styles.timeButton, !isPickerReady && styles.disabledButton]} 
            onPress={handleOpenTimePicker}
            disabled={!isPickerReady}
          >
            <Text style={styles.timeButtonText}>{scheduledTime.toLocaleString()}</Text>
          </TouchableOpacity>
        </View>

        {showTimePicker && scheduledTime && (
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={scheduledTime}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
              minimumDate={new Date()}
              maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)} // 1 year from now
              is24Hour={false}
              timeZoneOffsetInMinutes={undefined}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity 
                style={styles.doneButton} 
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

         <View style={styles.buttonContainer}>
          <Button
            title="Schedule Notification"
            onPress={scheduleNotification}
            color="#007AFF"
            disabled={!permissionGranted}
          />
        </View>

         {isScheduled && (
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel Scheduled Notification"
              onPress={cancelScheduledNotifications}
              color="#FF3B30"
            />
          </View>
        )}

         {isScheduled && (
          <View style={styles.statusContainer}>
            <Text style={styles.scheduledText}>
              ✅ Notification scheduled for {scheduledTime.toLocaleString()}
            </Text>
          </View>
        )}

         <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instructionsText}>
            1. Make sure notifications are enabled
          </Text>
          <Text style={styles.instructionsText}>
            2. Choose your preferred time (optional)
          </Text>
          <Text style={styles.instructionsText}>
            3. Press "Schedule Notification"
          </Text>
          <Text style={styles.instructionsText}>
            4. The notification will appear even when the app is in foreground
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  timeContainer: {
    width: '100%',
    marginBottom: 20,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  timeButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  timeButtonText: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  scheduledText: {
    fontSize: 14,
    color: '#34C759',
    textAlign: 'center',
    fontWeight: '600',
    padding: 10,
  },
  instructionsContainer: {
    width: '100%',
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  instructionContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  instructionStep: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  instructionCode: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#333',
    color: '#fff',
    padding: 8,
    borderRadius: 4,
    marginBottom: 5,
  },
  noteText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  doneButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
