# Forms & Inputs (Modern Field Pattern)

## Contents

- [Core Components Hierarchy](#core-components-hierarchy)
- [Forms use FieldGroup + Field](#forms-use-fieldgroup--field)
- [Responsive Layout & Orientation](#responsive-layout--orientation)
- [FieldSet + FieldLegend for Semantic Grouping](#fieldset--fieldlegend-for-semantic-grouping)
- [Field Content & Title Composition](#field-content--title-composition)
- [InputGroup Requirements](#inputgroup-requires-inputgroupinputinputgrouptextarea)
- [Field Validation and Disabled States](#field-validation-and-disabled-states)
- [Field Separator](#field-separator)

---

## Core Components Hierarchy

The modern Shadcn form architecture follows a specific nesting pattern:
1. `FieldSet`: Top-level semantic grouping (e.g., "Account Information").
2. `FieldLegend` / `FieldDescription`: Title and subtitle for the FieldSet.
3. `FieldGroup`: Container for multiple `Field` components, managing spacing and responsive containers.
4. `Field`: Wrapper for a single input control.
5. `FieldLabel` / `FieldTitle`: The label for the input.
6. `Input` / `Select` / `Switch`: The control itself.
7. `FieldError` / `FieldDescription`: Validation messages and helper text.

---

## Forms use FieldGroup + Field

Never use raw `div` with `space-y-*` or `gap-*` for form spacing. Always use `FieldGroup` which provides built-in `@container` support and consistent gaps:

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" type="email" />
  </Field>
  <Field>
    <FieldLabel htmlFor="password">Password</FieldLabel>
    <Input id="password" type="password" />
  </Field>
</FieldGroup>
```

---

## Responsive Layout & Orientation

`Field` supports three orientations to handle different layout needs:

- `vertical` (Default): Stacks label, control, and helper text.
- `horizontal`: Aligns the label and control side-by-side.
- `responsive`: Switches from vertical to horizontal based on the parent's container width (requires `@container/field-group` on `FieldGroup`).

```tsx
// Horizontal layout (Common in settings)
<Field orientation="horizontal">
  <FieldLabel htmlFor="newsletter">Subscribe</FieldLabel>
  <Switch id="newsletter" />
</Field>

// Responsive layout
<FieldGroup className="@container/field-group">
  <Field orientation="responsive">
    <FieldLabel htmlFor="theme">Theme</FieldLabel>
    <Select id="theme">...</Select>
  </Field>
</FieldGroup>
```

---

## FieldSet + FieldLegend for Semantic Grouping

Use `FieldSet` + `FieldLegend` to group related inputs (e.g., Address, Billing, Security):

```tsx
<FieldSet>
  <FieldLegend variant="legend">Security Settings</FieldLegend>
  <FieldDescription>Manage your password and authentication methods.</FieldDescription>
  <FieldGroup>
    <Field>...</Field>
  </FieldGroup>
</FieldSet>
```

---

## Field Content & Title Composition

Use `FieldContent` to group label and description, especially when using horizontal layouts to keep them aligned correctly. Use `FieldTitle` for labels that don't directly reference an input ID (e.g., for Toggle Groups).

```tsx
<Field orientation="horizontal">
  <FieldContent>
    <FieldTitle>Marketing Emails</FieldTitle>
    <FieldDescription>Receive updates about new products.</FieldDescription>
  </FieldContent>
  <Switch />
</Field>
```

---

## InputGroup requires InputGroupInput/InputGroupTextarea

Never use raw `Input` or `Textarea` inside an `InputGroup`.

**Correct:**
```tsx
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"

<InputGroup>
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon>
    <Button size="icon">
      <SearchIcon data-icon="inline-start" />
    </Button>
  </InputGroupAddon>
</InputGroup>
```

---

## Field Validation and Disabled States

Both `data-invalid` on the `Field` and `aria-invalid` on the control are required. `data-invalid` styles the container (label, description colors), while `aria-invalid` provides accessibility.

Always use `FieldError` for validation messages.

```tsx
// Integration with React Hook Form
<Field data-invalid={!!errors.email}>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input 
    id="email" 
    {...register("email")} 
    aria-invalid={!!errors.email} 
  />
  <FieldError errors={[errors.email]} />
</Field>

// Disabled state
<Field data-disabled>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" disabled />
</Field>
```

---

## Field Separator

Use `FieldSeparator` to provide a visual break within a `FieldGroup`. It can optionally include text.

```tsx
<FieldGroup>
  <Field>...</Field>
  <FieldSeparator>Or</FieldSeparator>
  <Field>...</Field>
</FieldGroup>
```
