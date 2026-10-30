const form = document.querySelector('#application-form');
const feedback = document.querySelector('#form-feedback');
const submit = document.querySelector('#submit-button');
let submitting = false;
function clearErrors() {
  feedback.textContent = '';
  for (const field of form.elements) field.removeAttribute('aria-invalid');
  document.querySelectorAll('.field-error').forEach(node => { node.textContent = ''; });
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting || !form.reportValidity()) return;
  clearErrors();
  submitting = true;
  submit.disabled = true;
  submit.textContent = '신청하는 중…';
  form.setAttribute('aria-busy', 'true');
  try {
    const response = await fetch('https://bitgyeol-api-sragon.imset0512.chatgpt.site/api/applications', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.elements.name.value, age: Number(form.elements.age.value),
        gender: form.elements.gender.value, mediaExperience: form.elements.mediaExperience.checked,
        email: form.elements.email.value, phone: form.elements.phone.value,
        consent: form.elements.consent.checked })
    });
    const result = await response.json();
    if (!response.ok) {
      for (const [key, message] of Object.entries(result.error?.fields ?? {})) {
        const error = document.getElementById(`${key}-error`);
        if (error) { error.textContent = message; form.elements[key].setAttribute('aria-invalid', 'true'); }
      }
      form.querySelector('[aria-invalid="true"]')?.focus();
      throw new Error(result.error?.message ?? '신청을 처리하지 못했습니다. 다시 시도해주세요.');
    }
    document.querySelector('#receipt-id').textContent = result.data.id;
    document.querySelector('#form-section').hidden = true;
    document.querySelector('#success-section').hidden = false;
    document.querySelector('#success-section').focus();
  } catch (error) {
    feedback.textContent = error instanceof TypeError
      ? '서버에 연결하지 못했습니다. 입력 내용은 유지되어 있어요. 연결을 확인한 후 다시 시도해주세요.' : error.message;
  } finally {
    submitting = false;
    submit.disabled = false;
    submit.textContent = '신청하기 ↗';
    form.removeAttribute('aria-busy');
  }
});
document.querySelector('#another-application').addEventListener('click', () => {
  form.reset(); clearErrors();
  document.querySelector('#receipt-id').textContent = '';
  document.querySelector('#success-section').hidden = true;
  document.querySelector('#form-section').hidden = false;
  form.elements.name.focus();
});
