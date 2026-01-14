import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, writeBatch } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 1. Check Auth Status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. Real-time Database Listener
  useEffect(() => {
    if (user) {
      // Query: Get notifications for THIS user, ordered by time
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      // onSnapshot updates automatically whenever the DB changes
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(notifs);
      });

      return () => unsubscribe();
    }
  }, [user]);

  // 3. Logic: Create Notification
  const createNotification = async (title, message) => {
    if (!user) return;
    await addDoc(collection(db, "notifications"), {
      userId: user.uid,
      title: title,
      message: message,
      read: false,
      createdAt: serverTimestamp() // Firestore Server Time
    });
  };

  // 4. Logic: Mark as Read
  const markAsRead = async (id) => {
    const notifRef = doc(db, "notifications", id);
    await updateDoc(notifRef, { read: true });
  };

  // 5. Logic: Mark ALL as Read (Batch Write)
  const markAllRead = async () => {
    const batch = writeBatch(db);
    notifications.forEach(notif => {
      if (!notif.read) {
        const ref = doc(db, "notifications", notif.id);
        batch.update(ref, { read: true });
      }
    });
    await batch.commit();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '2px solid #2c1810', paddingBottom: '20px' }}>
        <div>
            <h1>The Daily Ledger</h1>
            <p>Welcome, {user?.email}</p>
        </div>
        <button onClick={() => signOut(auth)} className="btn-vintage btn-outline">Log Out</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* LEFT: ACTIONS */}
        <div className="paper-card fade-in">
            <h3>Actions</h3>
            <p style={{marginBottom: '15px', fontSize: '0.9rem'}}>Trigger events to receive correspondence.</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <button 
                  className="btn-vintage" 
                  onClick={() => createNotification("Job Offer", "You have a new contract offer from London.")}
                >
                  Apply for Job
                </button>
                <button 
                  className="btn-vintage"
                  onClick={() => createNotification("System Alert", "Your ink supply is running critically low.")}
                >
                  Check Inventory
                </button>
                <button 
                  className="btn-vintage"
                  onClick={() => createNotification("Security", "Someone attempted to access your archives.")}
                >
                  Run Security
                </button>
            </div>
        </div>

        {/* RIGHT: INBOX */}
        <div className="paper-card fade-in">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h3>Inbox ({notifications.filter(n => !n.read).length})</h3>
                <button onClick={markAllRead} style={{background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'Cormorant Garamond', fontSize: '1rem'}}>
                    Mark all as read
                </button>
            </div>

            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {notifications.length === 0 ? <p>No correspondence yet.</p> : null}

                {notifications.map(notif => (
                    <div 
                        key={notif.id} 
                        onClick={() => markAsRead(notif.id)}
                        className="hover-lift"
                        style={{
                            padding: '15px',
                            borderBottom: '1px solid #d6c4a1',
                            background: notif.read ? 'transparent' : 'rgba(138, 51, 36, 0.1)', // Red tint if unread
                            cursor: 'pointer',
                            transition: 'background 0.3s'
                        }}
                    >
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <strong style={{fontSize: '1.1rem'}}>{notif.title}</strong>
                            { !notif.read && <span style={{fontSize: '0.8rem', color: '#8a3324'}}>NEW</span> }
                        </div>
                        <p style={{fontSize: '0.95rem'}}>{notif.message}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}