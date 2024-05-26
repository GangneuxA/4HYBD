import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonRefresher, IonRefresherContent, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import Logout from "./Logout"
import { Preferences } from '@capacitor/preferences';
import { global } from "../Global";
import { sendOutline, trashBin, trashBinOutline } from 'ionicons/icons';
import { Camera, CameraResultType } from '@capacitor/camera';
import Pica from 'pica'

const Messages: React.FC = () => {

    const [users, setUsers] = useState<any[]>([])
    const [conv, setConv] = useState<any[]>([])
    const [convUser, setConvUser] = useState<any[]>([])
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const modal = useRef<HTMLIonModalElement>(null)
    let [results, setResults] = useState<any[]>([]);
    const [message, setMessage] = useState('')
    const [image, setImage] = useState<any>(null)
    const [imagetmp, setImageTmp] = useState<any>(null)

    const formData = new FormData();

    const takePicture = async () => {
        try {
            const pic = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Base64,
            });

            if (pic.base64String) {
                
                const imgtmp = `data:image/jpeg;base64,${pic.base64String}`;
                setImageTmp(imgtmp);
        
                
                const byteString = atob(pic.base64String);
                const mimeString = 'image/jpeg';
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const originalBlob = new Blob([ab], { type: mimeString });
        
                const img = new Image();
                img.src = URL.createObjectURL(originalBlob);
        
                img.onload = async () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 500;
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;
        
                    const pica = Pica();
                    const resizedCanvas = await pica.resize(img, canvas, {
                        quality: 3,
                    });
        
                    const resizedBlob = await pica.toBlob(resizedCanvas, 'image/jpeg', 0.90);
                    setImage(resizedBlob);
                };
            } else {
                console.error('Base64 string is undefined');
            }
        } catch (error) {
            console.error('Error taking picture:', error);
        }
    };
    

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

            formData.append('receiver', selectedUser.id);
            formData.append('message', message);
            if (image) {
                formData.append('image', image, 'photo.jpg');
            }
            const { value: token } = await Preferences.get({ key: 'token' });
            const response = await fetch(`${global.URL_BACK}message`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            console.log(response)

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

    const ImageDecoder = ( imageBase64: string ) => {
      
        const img = `data:image/jpeg;base64,${imageBase64}`
      
        return (
            <img src={img} alt="Image décoder" />
        );
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
                                        {conv.image != null && (
                                            ImageDecoder(conv.image)
                                        )}
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
                                    <IonButton expand='full' onClick={takePicture}>Take Picture</IonButton>
                                    
                                    {imagetmp && <IonImg src={imagetmp} className="fixed-size-img" alt="Photo"/>}
                                    
                                    <IonButton expand='full' type="submit" className='ion-margin-top'>
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