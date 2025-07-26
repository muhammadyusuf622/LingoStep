import { BadGatewayException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma';

@Injectable()
export class VideoChatService {
  offers: any[];
  connectedSockets: any[];
  user: any;
  socket: Socket;
  constructor(private readonly prisma: PrismaService) {
    this.offers = [];
    this.connectedSockets = [];
  }

  async handleConnection(socket: Socket) {

    try {
        const password = socket.handshake.auth.password;
        const userId = socket.handshake.auth.userId;
        this.socket = socket;


        const user = await this.prisma.user.findUnique({
          where: { id: userId },
        });


        this.user = user;

        socket.on('disconnect', (reason) => {
          const deleteConnected = this.connectedSockets.findIndex(
            (s) => s.socketId === socket.id,
          );

          if (deleteConnected !== -1) {
            this.connectedSockets.splice(deleteConnected, 1);
          }

          const deleteOffer = this.offers.findIndex(
            (of) => of.socketId === socket.id,
          );

          if (deleteOffer !== -1) {
            this.offers.splice(deleteOffer, 1);
          }

          socket.broadcast.emit('disconnectOffers', user?.username);
        });

        if (password !== 'xsalom') {
          socket.disconnect(true);
          return;
        }

        this.connectedSockets.push({
          socketId: socket.id,
          username: user?.username,
        });

        if (this.offers.length) {
          const newOffers = this.offers.filter((of) => !of.answererUsername);
          socket.emit('availableOffers', newOffers);
        }
    } catch (error) {
      console.log(error?.message)
    }
  }

  async newOffer(newOffer: any) {

    let imgUrl: any;

    if (this.user?.imgUrl?.startsWith('https://cdn-icons-png')) {
      imgUrl = this.user.imgUrl;
    } else if (this.user?.imgUrl) {
      imgUrl = process.env.BACKEND_URL + this.user.imgUrl;
    } else {
      imgUrl = "https://cdn-icons-png.freepik.com/256/18238/18238419.png";   
    }

    this.offers.push({
      offererUsername: this.user.username,
      offerImgUrl: imgUrl,
      offer: newOffer,
      offerIceCandidates: [],
      answererUsername: null,
      answer: null,
      answererIceCandidates: [],
      socketId: this.socket.id,
    });

    this.socket.broadcast.emit('newOfferAwaiting', this.offers.slice(-1));
  }

  async newAnswer(offerObj: any, ackFunction: any, server: Server) {
    const socketToAnswer = this.connectedSockets.find(
      (s) => s.username === offerObj.offererUsername,
    );

    if (!socketToAnswer) {
      console.log('No matching socket');
      return;
    }

    const socketIdToAnswer = socketToAnswer.socketId;

    const offerToUpdate = this.offers.find(
      (o) => o.offererUsername === offerObj.offererUsername,
    );

    if (!offerToUpdate) {
      console.log('No OfferToUpdate');
      return;
    }

    ackFunction(offerToUpdate.offerIceCandidates);
    offerToUpdate.answer = offerObj.answer;
    offerToUpdate.answererUsername = this.user.username;
    const foundUser = this.offers.find(
      (offer) => offer.offererUsername == this.user.username,
    );
    foundUser.answererUsername = offerToUpdate.offererUsername;
    server.emit('connectedUsers', {
      user1: offerToUpdate.answererUsername,
      user2: offerToUpdate.offererUsername,
    });
    this.socket.to(socketIdToAnswer).emit('answerResponse', offerToUpdate);
  }

  async sendIceCandidateToSignalingServer(iceCandidateObj: any) {
    const { didOfer, iceUsername, iceCandidate } = iceCandidateObj;

    if (didOfer) {
      const offerInOffers = this.offers.find(
        (o) => o.offererUsername === iceUsername,
      );

      if (offerInOffers) {
        offerInOffers.offerIceCandidates.push(iceCandidate);

        if (offerInOffers.answererUsername) {
          const socketToSendTo = this.connectedSockets.find(
            (s) => s.username === offerInOffers.answererUsername,
          );

          if (socketToSendTo) {
            this.socket
              .to(socketToSendTo.socketId)
              .emit('receivedIceCandidateFromServer', iceCandidate);
          } else {
            console.log('Ice candidate recieved but could not find answere');
          }
        }
      }
    } else {
      const offerInOffers = this.offers.find(
        (o) => o.answererUsername === iceUsername,
      );
      if (!offerInOffers) {
        console.log('no offers available');
        return;
      }
      const socketToSendTo = this.connectedSockets.find(
        (s) => s.username === offerInOffers.offererUsername,
      );

      if (socketToSendTo) {
        this.socket
          .to(socketToSendTo.socketId)
          .emit('receivedIceCandidateFromServer', iceCandidate);
      } else {
        console.log('Ice candidate recieved but could not find offerer');
      }
    }
  }

  async hungUpPhone(data: any) {
    let sokketIdAnswer: any;

    const index = this.offers.findIndex(
      (item) => item.offererUsername === data.username,
    );

    if (index !== -1) {
      this.offers.forEach((item) => {
        if (item.offererUsername == this.offers[index].answererUsername) {
          item.answererUsername = null;
          sokketIdAnswer = item.socketId;
        }
      });

      this.socket.to(sokketIdAnswer).emit('answerUserHangup', 'check');
      this.offers.splice(index, 1);
    }
  }
}
