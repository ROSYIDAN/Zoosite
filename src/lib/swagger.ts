import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'ZooSite Backend APIs',
        version: '1.0',
        description: 'Automated OpenAPI specifications for ZooSite endpoints.',
      },
      paths: {
        '/api/dashboard/browse/region': {
          get: { tags: ['Dashboard Browse'], summary: 'Browse Regions', description: 'Fetches unique regions from the database', responses: { 200: { description: 'Success' } } }
        },
         '/api/dashboard/browse/habitat': {
          get: { tags: ['Dashboard Browse'], summary: 'Browse Habitats', description: 'Fetches distinct habitats', responses: { 200: { description: 'Success' } } }
        },
         '/api/dashboard/explore/region': {
          get: { 
            tags: ['Dashboard Explore'],
            summary: 'Explore Region', 
            parameters: [{ name: 'region', in: 'query', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Success' } } 
          }
        },
         '/api/dashboard/explore/habitat': {
          get: { 
            tags: ['Dashboard Explore'],
            summary: 'Explore Habitat', 
            parameters: [{ name: 'habitat', in: 'query', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Success' } } 
          }
        },
         '/api/dashboard/classes': {
          get: { tags: ['Dashboard Dynamic'], summary: 'Animal Classes', description: 'Returns a list of all animal classes (e.g. Mammals, Birds) with animal counts', responses: { 200: { description: 'Success' } } }
        },
         '/api/dashboard/trending': {
          get: { 
            tags: ['Dashboard Dynamic'],
            summary: 'Trending Animals', 
            parameters: [{ name: 'detail', in: 'query', required: false, schema: { type: 'string' } }],
            responses: { 200: { description: 'Success' } } 
          }
        },
         '/api/dashboard/stats/animals-lived': {
          get: { 
            tags: ['Dashboard Stats'],
            summary: 'Animals Lived Count', 
            parameters: [
              { name: 'region', in: 'query', required: false, schema: { type: 'string' } },
              { name: 'habitat', in: 'query', required: false, schema: { type: 'string' } },
            ],
            responses: { 200: { description: 'Success' } } 
          }
        },
         '/api/dashboard/stats/totals': {
          get: { tags: ['Dashboard Stats'], summary: 'Totals', responses: { 200: { description: 'Success' } } }
        },
        '/api/animals/{slug}': {
           get: {
             tags: ['Animals'],
             summary: 'Get Animal by Slug or ID',
             description: 'Returns full animal details including taxonomy (class, family, genus, order), habitats, distribution, images, and stats',
             parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' }, description: 'The slug or ID of the animal' }],
             responses: { 200: { description: 'Success' } }
           },
           patch: {
             tags: ['Animal Form Input'],
             summary: 'Update Animal (Animal Form API Edit)',
             description: 'Updates an existing animal record by its ID using form body fields.',
             parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' }, description: 'The ID of the animal to update' }],
             requestBody: {
               content: {
                 'application/json': {
                   schema: {
                     type: 'object',
                     properties: {
                       name: { type: 'string', description: 'Common name of the animal (e.g. Iberian Lynx)' },
                       scientific_name: { type: 'string', description: 'Scientific name of the animal (e.g. Lynx pardinus)' },
                       family: { type: 'string', description: 'Taxonomic family (e.g. Felidae)' },
                       genus: { type: 'string', description: 'Taxonomic genus (e.g. Lynx)' },
                       ordo: { type: 'string', description: 'Taxonomic order / Diet type mapping' },
                       class_id: { type: 'string', format: 'uuid', description: 'UUID of the animal class' },
                       description: { type: 'string', description: 'Detailed summary/description of the species' },
                       description_source: { type: 'string', description: 'Source URL of description (e.g. Wikipedia link)' },
                       image: { type: 'string', description: 'Hosted image URL' },
                       image_source: { type: 'string', description: 'Legacy image source/citation' },
                       photographer_name: { type: 'string', description: 'Photographer name displayed on the animal detail image' },
                       diet: { type: 'string', description: 'Diet type classification (e.g. Carnivore, Herbivore, Omnivore)' },
                       lifespan_years: { type: 'string', description: 'Average lifespan range in years' },
                       weight_kg: { type: 'string', description: 'Average weight range in kg' },
                       height_cm: { type: 'string', description: 'Average height range in cm' },
                       avg_speed_kmh: { type: 'string', description: 'Average travel speed in km/h' },
                       top_speed_kmh: { type: 'string', description: 'Top speed in km/h' },
                       social_structure: { type: 'string', description: 'Social behavior pattern' },
                       conservation_status: { type: 'string', description: 'IUCN conservation status' },
                       predators: { type: 'string', description: 'Common predators list' },
                       tags: { type: 'array', items: { type: 'string' }, description: 'Array of tag names' },
                       countries: { type: 'array', items: { type: 'string' }, description: 'Array of country UUIDs' },
                       habitats: { type: 'array', items: { type: 'string' }, description: 'Array of habitat UUIDs' }
                     }
                   }
                 }
               }
             },
             responses: {
               200: { description: 'Updated successfully' },
               400: { description: 'Validation failed' },
               500: { description: 'Internal server error' }
             }
           }
        },
        '/api/animals': {
           get: {
             tags: ['Animals'],
             summary: 'List Animals',
             parameters: [
                { name: 'limit', in: 'query', required: false, schema: { type: 'string' } },
                { name: 'diet', in: 'query', required: false, schema: { type: 'string' } }
             ],
             responses: { 200: { description: 'Success' } }
           },
           post: {
             tags: ['Animal Form Input'],
             summary: 'Create Animal (API Animal Input)',
             description: 'Creates a new animal record in the database with cascading tags, habitats, and distribution entries.',
             requestBody: {
               content: {
                 'application/json': {
                   schema: {
                     type: 'object',
                     required: ['name', 'scientific_name'],
                     properties: {
                       name: { type: 'string', description: 'Common name of the animal (e.g. Iberian Lynx)' },
                       scientific_name: { type: 'string', description: 'Scientific name of the animal (e.g. Lynx pardinus)' },
                       family: { type: 'string', description: 'Taxonomic family (e.g. Felidae)' },
                       genus: { type: 'string', description: 'Taxonomic genus (e.g. Lynx)' },
                       ordo: { type: 'string', description: 'Taxonomic order / Diet type mapping' },
                       class_id: { type: 'string', format: 'uuid', description: 'UUID of the animal class' },
                       description: { type: 'string', description: 'Detailed summary/description of the species' },
                       description_source: { type: 'string', description: 'Source URL of description (e.g. Wikipedia link)' },
                       image: { type: 'string', description: 'Hosted image URL' },
                       image_source: { type: 'string', description: 'Legacy image source/citation' },
                       photographer_name: { type: 'string', description: 'Photographer name displayed on the animal detail image' },
                       diet: { type: 'string', description: 'Diet type classification (e.g. Carnivore, Herbivore, Omnivore)' },
                       lifespan_years: { type: 'string', description: 'Average lifespan range in years' },
                       weight_kg: { type: 'string', description: 'Average weight range in kg' },
                       height_cm: { type: 'string', description: 'Average height range in cm' },
                       avg_speed_kmh: { type: 'string', description: 'Average travel speed in km/h' },
                       top_speed_kmh: { type: 'string', description: 'Top speed in km/h' },
                       social_structure: { type: 'string', description: 'Social behavior pattern' },
                       conservation_status: { type: 'string', description: 'IUCN conservation status' },
                       predators: { type: 'string', description: 'Common predators list' },
                       tags: { type: 'array', items: { type: 'string' }, description: 'Array of tag names' },
                       countries: { type: 'array', items: { type: 'string' }, description: 'Array of country UUIDs' },
                       habitats: { type: 'array', items: { type: 'string' }, description: 'Array of habitat UUIDs' }
                     }
                   }
                 }
               }
             },
             responses: {
               201: {
                 description: 'Created successfully',
                 content: {
                   'application/json': {
                     schema: {
                       type: 'object',
                       properties: {
                         message: { type: 'string' }
                       }
                     }
                   }
                 }
               },
               400: { description: 'Validation failed' },
               500: { description: 'Internal server error' }
             }
           }
        },
        '/api/animals/taxonomy': {
          get: {
            tags: ['Animal Form Input'],
            summary: 'Autocomplete Taxonomy Fields',
            description: 'Returns distinct taxonomy values (family, genus, or ordo/diet) from existing database records, with support for search and cascading filters.',
            parameters: [
              { name: 'field', in: 'query', required: true, schema: { type: 'string', enum: ['family', 'genus', 'ordo'] }, description: 'The field to fetch values for.' },
              { name: 'q', in: 'query', required: false, schema: { type: 'string' }, description: 'Search term to filter results (case-insensitive).' },
              { name: 'class_id', in: 'query', required: false, schema: { type: 'string', format: 'uuid' }, description: 'Filter by animal class ID (UUID).' },
              { name: 'family', in: 'query', required: false, schema: { type: 'string' }, description: 'Filter by family name.' },
              { name: 'ordo', in: 'query', required: false, schema: { type: 'string' }, description: 'Filter by diet type (stored in DB column `ordo`).' }
            ],
            responses: {
              200: {
                description: 'Success',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: { type: 'string' }
                    }
                  }
                }
              },
              400: { description: 'Invalid field parameter.' },
              500: { description: 'Internal server error.' }
            }
          }
        },
        '/api/countries': {
           get: {
             tags: ['Geographical Distribution'],
             summary: 'Search Countries and Flags',
             description: 'Searches countries and their corresponding flags or maps by a query keyword.',
             parameters: [
               { name: 'q', in: 'query', required: false, schema: { type: 'string' }, description: 'Query keyword to filter countries (case-insensitive)' }
             ],
             responses: {
               200: {
                 description: 'Success',
                 content: {
                   'application/json': {
                     schema: {
                       type: 'object',
                       properties: {
                         data: {
                           type: 'array',
                           items: {
                             type: 'object',
                             properties: {
                               id: { type: 'string', format: 'uuid' },
                               country: { type: 'string' },
                               country_flag: { type: 'string', nullable: true }
                             }
                           }
                         }
                       }
                     }
                   }
                 }
               }
             }
           }
        },
        '/api/animals/{slug}/image': {
           get: {
             tags: ['Animals'],
             summary: 'Get Animal Image by Slug',
             description: 'Redirects to the ImgBB hosted URL for the animal.',
             parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
             responses: { 
               200: { 
                 description: 'Redirect to ImgBB URL',
               },
               404: { description: 'Animal not found' }
             }
           }
        },
        '/api/animals/{id}/imgbb': {
           get: {
             tags: ['Animals'],
             summary: 'Get Animal ImgBB Image URL',
             description: 'Retrieves the ImgBB hosted URL for the animal from the database using its ID.',
             parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
             responses: { 
               200: { 
                 description: 'Success',
                 content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'object', properties: { imageUrl: { type: 'string' } } } } } } }
               },
               404: { description: 'Animal or image not found' }
             }
           }
        },
        '/api/quiz/questions': {
          get: {
            tags: ['Quiz (User)'],
            summary: 'Fetch Quiz Questions',
            description: 'Returns questions for a specific level without revealing the correct answers.',
            parameters: [
              { name: 'level', in: 'query', required: true, schema: { type: 'string', enum: ['EASY', 'NORMAL', 'HARD'] } }
            ],
            responses: { 200: { description: 'Success' } }
          }
        },
        '/api/quiz/verify': {
          post: {
            tags: ['Quiz (User)'],
            summary: 'Verify Answer',
            description: 'Submits user selections and returns whether they are correct.',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['question_id', 'selected_option_ids'],
                    properties: {
                      question_id: { type: 'string', format: 'uuid' },
                      selected_option_ids: { type: 'array', items: { type: 'string', format: 'uuid' } }
                    }
                  }
                }
              }
            },
            responses: { 200: { description: 'Success' } }
          }
        },
        '/api/admin/quiz/questions': {
          get: {
            tags: ['Quiz (Admin)'],
            summary: 'List All Questions',
            description: 'Returns all questions including correct answers. Filterable by level.',
            parameters: [
              { name: 'level', in: 'query', required: false, schema: { type: 'string', enum: ['EASY', 'NORMAL', 'HARD'] } }
            ],
            responses: { 200: { description: 'Success' } }
          },
          post: {
            tags: ['Quiz (Admin)'],
            summary: 'Create Question',
            description: 'Adds a new question to the question bank.',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['prompt', 'level', 'pattern', 'options'],
                    properties: {
                      prompt: { type: 'string' },
                      level: { type: 'string', enum: ['EASY', 'NORMAL', 'HARD'] },
                      pattern: { type: 'string', enum: ['SINGLE_PICK_LIST', 'MULTI_PICK_GRID', 'IMAGE_RECOGNITION'] },
                      reference_id: { type: 'string', format: 'uuid', nullable: true },
                      media_url: { type: 'string', format: 'uri', nullable: true },
                      options: {
                        type: 'array',
                        items: {
                          type: 'object',
                          required: ['label', 'is_correct'],
                          properties: {
                            label: { type: 'string' },
                            is_correct: { type: 'boolean' },
                            media_url: { type: 'string', format: 'uri', nullable: true }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            responses: { 201: { description: 'Created' } }
          }
        },
        '/api/admin/quiz/questions/{id}': {
          delete: {
            tags: ['Quiz (Admin)'],
            summary: 'Delete Question',
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
            ],
            responses: { 200: { description: 'Success' } }
          }
        }
      },
    },

  });
  return spec;
};
