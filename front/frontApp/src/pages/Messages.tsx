import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonRefresher, IonRefresherContent, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import Logout from "./Logout"
import { Preferences } from '@capacitor/preferences';
import { global } from "../Global";
import { sendOutline, trashBin, trashBinOutline } from 'ionicons/icons';

const Messages: React.FC = () => {

    const [users, setUsers] = useState<any[]>([])
    const [conv, setConv] = useState<any[]>([])
    const [convUser, setConvUser] = useState<any[]>([])
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const modal = useRef<HTMLIonModalElement>(null)
    let [results, setResults] = useState<any[]>([]);
    const [message, setMessage] = useState('')

    const formData = new FormData();

    const GetAllUsers = async () => {
        try {
            const { value: token } = await Preferences.get({ key: 'token' });
            const response = await fetch(`${global.URL_BACK}users`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json();
            setUsers(data)
        } catch (error) {
            console.error('Error during fetch:', error)
        }
    };

    const GetAllConv = async () => {
        try {
            const { value: token } = await Preferences.get({ key: 'token' });
            const response = await fetch(`${global.URL_BACK}conversation`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json();
            setConv(data)
        } catch (error) {
            console.error('Error during fetch:', error)
        }
    };

    const GetConvUser = async (user: any) => {
        try {
            setResults([])
            setSelectedUser(user)
            const { value: token } = await Preferences.get({ key: 'token' });
            const response = await fetch(`${global.URL_BACK}message/${user.id}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json();
            setConvUser(data)
        } catch (error) {
            console.error('Error during fetch:', error)
        }
    };

    const Deletemessage = async (messageid: number) => {
        try {
            const { value: token } = await Preferences.get({ key: 'token' });
            const response = await fetch(`${global.URL_BACK}message/${messageid}`, {
                method: 'DELETE',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            setSelectedUser(null)
        } catch (error) {
            console.error('Error during fetch:', error)
        }
    };

    const sendmessage = async () => {
        try {
            formData.append('receiver', selectedUser?.id)
            formData.append('message', message)
            const { value: token } = await Preferences.get({ key: 'token' });
            const response = await fetch(`${global.URL_BACK}message`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            
        } catch (error) {
            console.error('Error during fetch:', error)
        }
    };


    const handleInput = (ev: Event) => {
        const query = (ev.target as HTMLIonSearchbarElement).value?.toLowerCase() || ''
        setResults(users.filter(user => user.pseudo.toLowerCase().includes(query)))
    };



    useEffect(() => {
        GetAllUsers()
        GetAllConv()
    }, []);

    const doRefresh = async (event:any) => {
        await GetAllUsers()
        await GetAllConv()
        event.detail.complete()
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color='primary'>
                    <IonTitle>Messages</IonTitle>
                    <Logout/>
                </IonToolbar>
                <IonToolbar color='primary'>
                    <IonSearchbar debounce={1000} onIonInput={handleInput} />
                </IonToolbar>
            </IonHeader>
            <IonContent >
                <IonRefresher slot='fixed' onIonRefresh={doRefresh}>
                    <IonRefresherContent/>
                </IonRefresher>
                <IonList>
                    {results.map((user, index) =>
                        <IonItem key={index} onClick={() => GetConvUser(user)}>
                            <IonLabel>
                                {user.pseudo}
                                <p>{user.email}</p>
                            </IonLabel>
                        </IonItem>
                    )}
                </IonList>
                {users.filter(user => conv.includes(user.id)).map((user, index) => 
                    <IonCard key={index} onClick={() => GetConvUser(user)} >
                        <IonCardContent className='ion-no-padding'>
                            <IonItem lines="none">
                                <IonLabel>
                                    {user.pseudo}
                                    <p>{user.email}</p>
                                </IonLabel>
                            </IonItem>
                        </IonCardContent>
                    </IonCard>
                )}
                <IonModal ref={modal} isOpen={selectedUser !== null} onIonModalDidDismiss={() => setSelectedUser(null)}>
                    <IonHeader>
                        <IonToolbar color='secondary'>
                            <IonButtons slot='start'>
                                <IonButton onClick={() => modal.current?.dismiss()}>Close</IonButton>
                            </IonButtons>
                            <IonTitle>
                                {selectedUser?.pseudo}
                            </IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        {convUser.map((conv, index) =>
                        <IonCard key={index}>
                            <IonCardContent className='ion-no-padding'>
                                <IonItem lines="none">
                                    <IonLabel>
                                        {conv.message}
                                        {conv.sender_id === selectedUser?.id && (
                                                <p>Sent by {selectedUser?.pseudo}</p>
                                        )}
                                    </IonLabel>
                                    <IonLabel>
                                        <p>send at {conv.timestamp}</p>
                                    </IonLabel>
                                    <IonButtons slot='end'>
                                        <IonButton onClick={() => Deletemessage(conv.id)} color='danger'>
                                            <IonIcon slot='icon-only' icon={trashBin}></IonIcon>
                                        </IonButton>
                                    </IonButtons>
                                </IonItem>
                            </IonCardContent>
                        </IonCard>
                        )}
                        <IonCard>
                            <IonCardContent>
                                <form onSubmit={sendmessage}>
                                    <IonInput
                                        fill="outline"
                                        labelPlacement="floating"
                                        label="message"
                                        type='text'
                                        value={message}
                                        onIonChange={(e: any) => setMessage(e.detail.value)}
                                    />
                                    <IonButton type="submit" className='ion-margin-top'>
                                        <IonIcon slot='icon-only' icon={sendOutline}></IonIcon>
                                    </IonButton>
                                </form>
                            </IonCardContent>
                        </IonCard>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default Messages;