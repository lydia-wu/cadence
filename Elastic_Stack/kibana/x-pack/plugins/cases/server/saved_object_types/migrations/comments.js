"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringifyCommentWithoutTrailingNewline = exports.migrateByValueLensVisualizations = exports.mergeMigrationFunctionMaps = exports.createCommentsMigrations = void 0;

var _lodash = require("lodash");

var _api = require("../../../common/api");

var _utils = require("../../../common/utils/markdown_plugins/utils");

var _ = require(".");

var _utils2 = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createCommentsMigrations = migrationDeps => {
  const embeddableMigrations = (0, _lodash.mapValues)(migrationDeps.lensEmbeddableFactory().migrations, migrateByValueLensVisualizations);
  const commentsMigrations = {
    '7.11.0': doc => {
      return { ...doc,
        attributes: { ...doc.attributes,
          type: _api.CommentType.user
        },
        references: doc.references || []
      };
    },
    '7.12.0': doc => {
      let attributes = { ...doc.attributes,
        associationType: _api.AssociationType.case
      }; // only add the rule object for alert comments. Prior to 7.12 we only had CommentType.alert, generated alerts are
      // introduced in 7.12.

      if (doc.attributes.type === _api.CommentType.alert) {
        attributes = { ...attributes,
          rule: {
            id: null,
            name: null
          }
        };
      }

      return { ...doc,
        attributes,
        references: doc.references || []
      };
    },
    '7.14.0': doc => {
      return (0, _.addOwnerToSO)(doc);
    }
  };
  return mergeMigrationFunctionMaps(commentsMigrations, embeddableMigrations);
};

exports.createCommentsMigrations = createCommentsMigrations;

const migrateByValueLensVisualizations = (migrate, version) => (doc, context) => {
  if (doc.attributes.comment == null) {
    return doc;
  }

  try {
    const parsedComment = (0, _utils.parseCommentString)(doc.attributes.comment);
    const migratedComment = parsedComment.children.map(comment => {
      if ((0, _utils.isLensMarkdownNode)(comment)) {
        // casting here because ts complains that comment isn't serializable because LensMarkdownNode
        // extends Node which has fields that conflict with SerializableRecord even though it is serializable
        return migrate(comment);
      }

      return comment;
    });
    const migratedMarkdown = { ...parsedComment,
      children: migratedComment
    };
    return { ...doc,
      attributes: { ...doc.attributes,
        comment: stringifyCommentWithoutTrailingNewline(doc.attributes.comment, migratedMarkdown)
      }
    };
  } catch (error) {
    (0, _utils2.logError)({
      id: doc.id,
      context,
      error,
      docType: 'comment',
      docKey: 'comment'
    });
    return doc;
  }
};

exports.migrateByValueLensVisualizations = migrateByValueLensVisualizations;

const stringifyCommentWithoutTrailingNewline = (originalComment, markdownNode) => {
  const stringifiedComment = (0, _utils.stringifyMarkdownComment)(markdownNode); // if the original comment already ended with a newline then just leave it there

  if (originalComment.endsWith('\n')) {
    return stringifiedComment;
  } // the original comment did not end with a newline so the markdown library is going to add one, so let's remove it
  // so the comment stays consistent


  return (0, _lodash.trimEnd)(stringifiedComment, '\n');
};
/**
 * merge function maps adds the context param from the original implementation at:
 * src/plugins/kibana_utils/common/persistable_state/merge_migration_function_map.ts
 *  */


exports.stringifyCommentWithoutTrailingNewline = stringifyCommentWithoutTrailingNewline;

const mergeMigrationFunctionMaps = (obj1, obj2) => {
  const customizer = (objValue, srcValue) => {
    if (!srcValue || !objValue) {
      return srcValue || objValue;
    }

    return (doc, context) => objValue(srcValue(doc, context), context);
  };

  return (0, _lodash.mergeWith)({ ...obj1
  }, obj2, customizer);
};

exports.mergeMigrationFunctionMaps = mergeMigrationFunctionMaps;