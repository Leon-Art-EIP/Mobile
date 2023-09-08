type ConversationType = {
  id: number;
  unread: boolean;
  status: 'untreated' | 'waiting' | 'finished';
  username: string;
  lastMessage: string;
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

export default CONVERSATIONS;
