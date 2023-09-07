type ConversationType = {
  id: number;
  unread: boolean;
  status: 'untreated' | 'waiting' | 'finished';
  username: string;
};

const CONVERSATIONS: ConversationType[] = [
  {
    id: 0,
    unread: true,
    status: 'untreated',
    username: 'Marine Weber'
  },
  {
    id: 1,
    unread: false,
    status: 'untreated',
    username: 'Evan Koehler'
  },
  {
    id: 2,
    unread: true,
    status: 'waiting',
    username: 'Vivant Garrigues'
  },
  {
    id: 3,
    unread: false,
    status: 'waiting',
    username: 'Marius Nowak'
  },
  {
    id: 4,
    unread: true,
    status: 'finished',
    username: 'Guillaume Paris'
  },
  {
    id: 5,
    unread: false,
    status: 'finished',
    username: 'Damien Demontis'
  }
];

export default CONVERSATIONS;
