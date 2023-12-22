self.addEventListener('push', function (event) {
    const options = {
        body: event.data.text(),
        icon: '/icon.jpg',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        sound: '/sound.mp3'
    };

    event.waitUntil(
        self.registration.showNotification('Location Alert', options)
    );
});
