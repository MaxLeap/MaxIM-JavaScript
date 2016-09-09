// Define all message struct.

// Message media type:  0=text,1=image,2=audio,3=video
enum Media{
    TEXT = 0,
    IMAGE = 1,
    AUDIO = 2,
    VIDEO = 3
}

enum Receiver{
    ACTOR = 0,
    GROUP = 1,
    ROOM = 2,
    PASSENGER = 3,
    STRANGER = 4
}

export interface Content {
    media?: Media;
    body: string;
}

export interface MessageTo {
    to: {
        id: string;
        type?: Receiver;
    };
    content: Content;
    push?: {
        enable?: boolean;
        sound?: string;
        prefix?: string;
        suffix?: string;
        contentAvailable?: boolean;
    };
    remark?: string;
}


/*    message struct
 {
 from: {
 id: 'FROM_ID',
 type: 0,    // 0 = friend, 1 = group, 2 = room, 3 = passenger, 4 = stranger
 gid: 'GROUP_OR_ROOM_ID'    //require if type is 1 or 2
 },
 content: {
 media: 0,
 body: 'YOUR_MESSAGE_BODY'
 },
 ts: 1455613127766, // send timestamp
 remark: 'YOUR_MESSAGE_REMARK'
 }
 */

export interface MessageFrom {
    from: {
        id: string;
        type?: Receiver;
        gid?: string;
    },
    content: Content;
    ts: number;
    remark?: string;
}

export interface SystemMessageFrom {
    content: Content;
    ts: number;
    remark?: string;
}