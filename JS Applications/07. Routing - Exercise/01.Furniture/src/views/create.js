import { createItem } from '../api/data.js';
import { html } from '../lib.js';

const createTemplate = (onSubmit, errMsg, errors) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>Create New Furniture</h1>
    </div>
    <div class="col-md-12">
        <h3>${errMsg ? html`<div class="form-group error">${errMsg}</div>` : ''}</h3>
    </div>
</div>
<form @submit=${onSubmit}>
    <div class="row space-top">
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="new-make">Make</label>
                <input class=${'form-control' + (errors.make ? ' is-invalid' : '')} id="new-make" type="text"
                    name="make">
            </div>
            <div class="form-group has-success">
                <label class="form-control-label" for="new-model">Model</label>
                <input class=${'form-control' + (errors.model ? ' is-invalid' : '')} id="new-model" type="text"
                    name="model">
            </div>
            <div class="form-group has-danger">
                <label class="form-control-label" for="new-year">Year</label>
                <input class=${'form-control' + (errors.year ? ' is-invalid' : '')} id="new-year" type="number"
                    name="year">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-description">Description</label>
                <input class=${'form-control' + (errors.description ? ' is-invalid' : '')} id="new-description"
                    type="text" name="description">
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="new-price">Price</label>
                <input class=${'form-control' + (errors.price ? ' is-invalid' : '')} id="new-price" type="number"
                    name="price">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-image">Image</label>
                <input class=${'form-control' + (errors.img ? ' is-invalid' : '')} id="new-image" type="text"
                    name="img">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-material">Material (optional)</label>
                <input class="form-control" id="new-material" type="text" name="material">
            </div>
            <input type="submit" class="btn btn-primary" value="Create" />
        </div>
    </div>
</form>`;

export function createPage(ctx) {
    update();

    function update(errMsg, errors = {}) {
        ctx.render(createTemplate(onSubmit, errMsg, errors));
    }

    async function onSubmit(event) {
        event.preventDefault();

        const formData = [...(new FormData(event.target)).entries()];
        const data = formData.reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {});

        const missing = formData.filter(([k, v]) => k != 'material' && v == '');

        data.year = Number(data.year);
        data.price = Number(data.price);

        try {
            if (missing.length > 0) {
                const errors = missing.reduce((a, [k, v]) => Object.assign(a, { [k]: true }) , {});

                throw {
                    error: new Error('Please fill all required fields!'),
                    errors
                }
            }

            if (data.make.length < 4 || data.model.length < 4) {
                throw {
                    error: new Error('Make and model must be at least 4 symbols long!'),
                    errors: {
                        make: data.make.length < 5,
                        model: data.model.length < 5,
                    }
                }
            }

            if (data.year < 1950 || data.year > 2050) {
                throw {
                    error: new Error('Year must be between 1950 and 2050!'),
                    errors: {
                        year: true,
                    }
                }
            }

            if (data.description.length <= 10) {
                throw {
                    error: new Error('Description must be more than 10 symbols!'),
                    errors: {
                        description: true,
                    }
                }
            }

            if (data.price < 0) {
                throw {
                    error: new Error('Price must be a positive number!'),
                    errors: {
                        price: true,
                    }
                }
            }

            const result = await createItem(data);
            ctx.page.redirect('/details/' + result._id);
        } catch (err) {
            const message = err.message || err.error.message;
            update(message, err.errors || {});
        }
    }
}
