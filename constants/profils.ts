type ConversationType = {
    id: number;
    unread: boolean;
    status: 'untreated' | 'waiting' | 'finished';
    username: string;
    lastMessage: string;
  };
  
  type MessageType = {
    senderId: number;
    receiverId: number;
    bodyType: 'text' | 'image' | 'offer'; // either 'text', 'image', or 'offer'
  
    /* offer: number = offered price
     * image: string = image url
     * text : string = message content
    */
    body: string | number; // number if offer : offered price ; string if image
  };
  
  const CONVERSATIONS: ConversationType[] = [
    {
      id: 0,
      unread: true,
      status: 'untreated',
      username: 'Marine Weber',
      lastMessage: 'Bonjour ! Oui, cette oeuvre est toujours disponible'
    },
    {
      id: 1,
      unread: false,
      status: 'untreated',
      username: 'Evan Koehler',
      lastMessage: 'Bonjour ! Oui, cette oeuvre est toujours disponible'
    },
    {
      id: 2,
      unread: true,
      status: 'waiting',
      username: 'Vivant Garrigues',
      lastMessage: 'Bonjour ! Oui, cette oeuvre est toujours disponible'
    },
    {
      id: 3,
      unread: false,
      status: 'waiting',
      username: 'Marius Nowak',
      lastMessage: 'Bonjour ! Oui, cette oeuvre est toujours disponible'
    },
    {
      id: 4,
      unread: true,
      status: 'finished',
      username: 'Guillaume Paris',
      lastMessage: 'Bonjour ! Oui, cette oeuvre est toujours disponible'
    },
    {
      id: 5,
      unread: false,
      status: 'finished',
      username: 'Damien Demontis',
      lastMessage: 'Bonjour ! Oui, cette oeuvre est toujours disponible'
    },
    {
      id: 6,
      unread: true,
      status: 'finished',
      username: 'Damien Demontis',
      lastMessage: 'Bonjour ! Oui, cette oeuvre est toujours disponible'
    },
    {
      id: 7,
      unread: false,
      status: 'untreated',
      username: 'Damien Demontis',
      lastMessage: 'Bonjour ! Oui, cette oeuvre est toujours disponible'
    }
  ];
  
  const MESSAGES: MessageType[] = [
    {
      senderId: 0,
      receiverId: 1,
      bodyType: 'text',
      body: 'Bonjour, je serais intéressé par cette oeuvre, mais je recherche une ambiance plus chaude. Serait-ce possible ? Merci !'
    },
    {
      senderId: 0,
      receiverId: 1,
      bodyType: 'image',
      body: 'https://www.carredartistes.com/fr-fr/content_images/composition-8-kandinsky2.jpg'
    },
    {
      senderId: 1,
      receiverId: 0,
      bodyType: 'text',
      body: 'Yes of course !'
    },
    {
      senderId: 1,
      receiverId: 0,
      bodyType: 'offer',
      body: 120
    }
  ];
  
  export {
    CONVERSATIONS,
    MESSAGES
  };
  
  export type {
    MessageType,
    ConversationType
  }
  