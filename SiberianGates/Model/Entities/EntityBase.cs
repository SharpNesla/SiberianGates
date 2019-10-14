﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SiberianGates.Model.Entities
{
  public class EntityBase
  {
    public long Id { get; set; }

    public DateTime DeletionDate { get; set; }
    public bool IsSelected { get; set; }
    public string Comment { get; set; }

    public virtual string Signature => Id.ToString();
  }
}