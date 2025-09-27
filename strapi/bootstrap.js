module.exports = async ({ strapi }) => {
  // Create default roles
  const authorRole = await strapi.service('plugin::users-permissions.role').create({
    name: 'Author',
    description: 'Can create and edit content',
    type: 'authenticated',
  });

  const reviewerRole = await strapi.service('plugin::users-permissions.role').create({
    name: 'Reviewer',
    description: 'Can review and approve content',
    type: 'authenticated',
  });

  const publisherRole = await strapi.service('plugin::users-permissions.role').create({
    name: 'Publisher',
    description: 'Can publish content',
    type: 'authenticated',
  });

  // Set permissions for Author role
  await strapi.service('plugin::users-permissions.role').updatePermissions(authorRole.id, {
    'api::exam.exam': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
    },
    'api::course.course': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
    },
    'api::subject.subject': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
    },
    'api::unit.unit': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
    },
    'api::chapter.chapter': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
    },
    'api::module.module': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
    },
    'api::paragraph.paragraph': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
    },
    'api::table.table': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
    },
    'api::image.image': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
    },
    'api::mcq.mcq': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
    },
    'api::module-content.module-content': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
    },
  });

  // Set permissions for Reviewer role (includes Author permissions + publish)
  await strapi.service('plugin::users-permissions.role').updatePermissions(reviewerRole.id, {
    'api::exam.exam': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'publish': true,
    },
    'api::course.course': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'publish': true,
    },
    'api::subject.subject': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'publish': true,
    },
    'api::unit.unit': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'publish': true,
    },
    'api::chapter.chapter': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'publish': true,
    },
    'api::module.module': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'publish': true,
    },
    'api::paragraph.paragraph': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'publish': true,
    },
    'api::table.table': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'publish': true,
    },
    'api::image.image': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'publish': true,
    },
    'api::mcq.mcq': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'publish': true,
    },
    'api::module-content.module-content': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'publish': true,
    },
  });

  // Set permissions for Publisher role (full access)
  await strapi.service('plugin::users-permissions.role').updatePermissions(publisherRole.id, {
    'api::exam.exam': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'delete': true,
      'publish': true,
    },
    'api::course.course': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'delete': true,
      'publish': true,
    },
    'api::subject.subject': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'delete': true,
      'publish': true,
    },
    'api::unit.unit': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'delete': true,
      'publish': true,
    },
    'api::chapter.chapter': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'delete': true,
      'publish': true,
    },
    'api::module.module': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'delete': true,
      'publish': true,
    },
    'api::paragraph.paragraph': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'delete': true,
      'publish': true,
    },
    'api::table.table': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'delete': true,
      'publish': true,
    },
    'api::image.image': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'delete': true,
      'publish': true,
    },
    'api::mcq.mcq': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'delete': true,
      'publish': true,
    },
    'api::module-content.module-content': {
      'find': true,
      'findOne': true,
      'create': true,
      'update': true,
      'delete': true,
      'publish': true,
    },
  });
};
