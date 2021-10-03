const info = () => `This is the API of a Hackernews Clone`;
const feed = async (_p, _args, context) => await context.prisma.link.findMany();
const link = async (_p, args, context) => await context.prisma.link.findUnique({
                where: {
                id: parseInt(args.id)
                }
            });
module.exports = {
    info,
    feed,
    link
}