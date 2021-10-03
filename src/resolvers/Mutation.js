const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

const post = async (_parent, args, context) => {
    const { userId } = context;
    console.log("jijijijijijiji", userId);
    const newLink = await context.prisma.link.create({
        data: {
            description: args.description,
            url: args.url,
            postedBy: { connect: {id: userId} }
        }
    });
    return newLink;
};
const updateLink = async (_p, args, context) => {
    const linkResult = await context.prisma.link.update({
        where: {
            id: parseInt(args.id)
        },
        data: {
            description: args.description ?? undefined,
            url: args.url ?? undefined
        }
    });
    return linkResult
};

const signup = async (_p, args, context) => {
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.prisma.user.create({
        data: {
            ...args,
            password
        }
    });
    const token = jwt.sign({userId: user.id}, APP_SECRET);

    return {
        token,
        user
    }
}

const login = async (_p, args, context) => {
    const user = await context.prisma.user.findUnique({
        where: {
            email: args.email
        }
    });
    if (!user) {
        throw new Error('User not found');
    }

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({userId: user.id}, APP_SECRET);

    return {
        token,
        user
    }
}

module.exports = {
    post,
    updateLink,
    signup,
    login
}