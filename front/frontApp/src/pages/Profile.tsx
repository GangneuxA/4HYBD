import { Preferences } from '@capacitor/preferences';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonImg, IonLabel, IonItem, IonLoading, IonToast, IonInput, IonGrid, IonRow, IonCol, useIonRouter, IonRefresher, IonRefresherContent } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { global } from "../Global";
import image from "../assets/images/user.jpg";
import Logout from "./Logout"

const Profile: React.FC = () => {

    const router = useIonRouter();
    
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [updatepassword, setUpdatePassword] = useState('');
    const [updatepseudo, setUpdatePseudo] = useState('');
    const [updateemail, setUpdateEmail] = useState('');
    const [showToast, setShowToast] = useState({ show: false, message: '', color: 'success' });
    const [editing, setEditing] = useState(false); 

    function sleep(ms: any) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const fetchUserData = async () => {
        
        try {
            const { value: token } = await Preferences.get({ key: 'token' });
            const response = await fetch(`${global.URL_BACK}getme`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();
            setPseudo(data['pseudo']);
            setEmail(data['email']);
            
        } catch (error) {
            
            setShowToast({ show: true, message: 'Failed to fetch user data', color: 'danger' });
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleUpdateUser = async () => {
        if (!editing) {
            setEditing(true);
            return;
        }

        
        await sleep(2000)
        try {

            console.log('Update Pseudo:', updatepseudo);
            console.log('Update Email:', updateemail);
            console.log('Update Password:', updatepassword);
            const { value: token } = await Preferences.get({ key: 'token' });
            const response = await fetch(`${global.URL_BACK}users`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: updateemail , pseudo: updatepseudo , password: updatepassword }),
            });

            
            setEditing(false);
            setShowToast({ show: true, message: 'Profile updated successfully', color: 'success' });

            await fetchUserData();
        } catch (error) {
            
            setShowToast({ show: true, message: 'Failed to update profile', color: 'danger' });
        }
    };

    const handleDeleteUser = async () => {
        
        try {
            const { value: token } = await Preferences.get({ key: 'token' });
            await fetch(`${global.URL_BACK}users`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            
            setShowToast({ show: true, message: 'Profile deleted successfully', color: 'success' });
            setPseudo('');
            setEmail('');
            await Preferences.remove({ key: 'token'})
            router.push('/', 'forward')
        } catch (error) {
            
            setShowToast({ show: true, message: 'Failed to delete profile', color: 'danger' });
        }
    };

    const doRefresh = async (event:any) => {
        await fetchUserData()
        event.detail.complete()
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color='primary'>
                    <IonTitle>Profile</IonTitle>
                    <Logout/>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonRefresher slot='fixed' onIonRefresh={doRefresh}>
                    <IonRefresherContent/>
                </IonRefresher>
                <IonGrid className="ion-text-center">
                    <IonRow>
                        <IonCol size='7' offset='5'>
                            <IonImg src={image} alt="Profile Image" />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonLabel>
                                <h2>Pseudo: {pseudo}</h2>
                            </IonLabel>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonLabel>
                                <p>Email: {email}</p>
                            </IonLabel>
                        </IonCol>
                    </IonRow>
                    {editing && (
                        <IonRow>
                            <IonCol size="4">
                                <IonItem>
                                    <IonInput labelPlacement="floating" label='Pseudo' type='text' placeholder={pseudo} onIonChange={e => setUpdatePseudo(e.detail.value!)} />
                                </IonItem>
                            </IonCol>
                            <IonCol size="4">
                                <IonItem>
                                    <IonInput labelPlacement="floating" label='Email' type="email" placeholder={email} onIonChange={e => setUpdateEmail(e.detail.value!)} />
                                </IonItem>
                            </IonCol>
                            <IonCol size="4">
                                <IonItem>
                                    <IonInput labelPlacement="floating" label='Password' type="password" onIonChange={e => setUpdatePassword(e.detail.value!)} />
                                </IonItem>
                            </IonCol>
                        </IonRow>
                    )}
                    <IonRow>
                        <IonCol>
                            <IonButton color="primary" onClick={handleUpdateUser}>
                                {editing ? 'Save Changes' : 'Update Profile'}
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton color="danger" onClick={handleDeleteUser} style={{ marginTop: '10px' }}>Delete Profile</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonToast
                    isOpen={showToast.show}
                    message={showToast.message}
                    color={showToast.color}
                    duration={2000}
                    onDidDismiss={() => setShowToast({ show: false, message: '', color: 'success' })}
                />
            </IonContent>
        </IonPage>
    );
};

export default Profile;
