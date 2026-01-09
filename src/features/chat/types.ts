export type Conversation = {
  id: string;
  user_a: string;
  user_b: string;
};

export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
};
